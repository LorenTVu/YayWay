const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');

// Store connected users and their socket info
const connectedUsers = new Map();
const roomSockets = new Map();

// Authenticate socket connection
const authenticateSocket = async (token) => {
  try {
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || user.isBanned) return null;
    
    return user;
  } catch (error) {
    return null;
  }
};

// Setup Socket.io handlers
const setupSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      const user = await authenticateSocket(token);
      
      if (user) {
        socket.user = user;
        // Update user's online status
        await user.updateOnlineStatus(true);
      }
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user?.username || 'Anonymous'}`);

    // Store socket info
    if (socket.user) {
      connectedUsers.set(socket.user._id.toString(), {
        socketId: socket.id,
        user: socket.user,
        rooms: new Set()
      });
    }

    // Join room
    socket.on('join-room', async (data) => {
      try {
        const { roomId, password } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const room = await Room.findById(roomId)
          .populate('host', 'username displayName avatar')
          .populate('participants.user', 'username displayName avatar');

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if room is password protected
        if (room.isPasswordProtected && room.password !== password) {
          socket.emit('error', { message: 'Invalid room password' });
          return;
        }

        // Check if room is full
        if (room.participantCount >= room.settings.maxParticipants) {
          socket.emit('error', { message: 'Room is full' });
          return;
        }

        // Join socket room
        socket.join(roomId);
        
        // Add user to room participants if not already there
        const existingParticipant = room.participants.find(p => 
          p.user._id.toString() === socket.user._id.toString() && p.isActive
        );

        if (!existingParticipant) {
          await room.addParticipant(socket.user._id, 'spectator');
        }

        // Store room info
        if (!roomSockets.has(roomId)) {
          roomSockets.set(roomId, new Set());
        }
        roomSockets.get(roomId).add(socket.id);

        if (connectedUsers.has(socket.user._id.toString())) {
          connectedUsers.get(socket.user._id.toString()).rooms.add(roomId);
        }

        // Emit room joined event
        socket.emit('room-joined', {
          room: room.getPublicData(),
          message: 'Successfully joined room'
        });

        // Notify other users in the room
        socket.to(roomId).emit('user-joined', {
          user: socket.user.getPublicProfile(),
          message: `${socket.user.displayName} joined the room`
        });

        // Send current room state to the new user
        socket.emit('room-state', {
          room: room.getPublicData(),
          participants: room.participants.filter(p => p.isActive).map(p => ({
            user: p.user.getPublicProfile(),
            role: p.role,
            joinedAt: p.joinedAt
          }))
        });

      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('leave-room', async (data) => {
      try {
        const { roomId } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Leave socket room
        socket.leave(roomId);

        // Remove user from room participants
        await room.removeParticipant(socket.user._id);

        // Remove from room sockets
        if (roomSockets.has(roomId)) {
          roomSockets.get(roomId).delete(socket.id);
          if (roomSockets.get(roomId).size === 0) {
            roomSockets.delete(roomId);
          }
        }

        // Remove from connected users
        if (connectedUsers.has(socket.user._id.toString())) {
          connectedUsers.get(socket.user._id.toString()).rooms.delete(roomId);
        }

        // Notify other users
        socket.to(roomId).emit('user-left', {
          user: socket.user.getPublicProfile(),
          message: `${socket.user.displayName} left the room`
        });

        socket.emit('room-left', {
          message: 'Successfully left room'
        });

      } catch (error) {
        console.error('Leave room error:', error);
        socket.emit('error', { message: 'Failed to leave room' });
      }
    });

    // Send chat message
    socket.on('send-message', async (data) => {
      try {
        const { roomId, message, type = 'text' } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        if (!message || message.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        if (message.length > 500) {
          socket.emit('error', { message: 'Message too long' });
          return;
        }

        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if chat is enabled
        if (!room.settings.enableChat) {
          socket.emit('error', { message: 'Chat is disabled in this room' });
          return;
        }

        // Check if user is in the room
        const participant = room.participants.find(p => 
          p.user.toString() === socket.user._id.toString() && p.isActive
        );

        if (!participant) {
          socket.emit('error', { message: 'You are not in this room' });
          return;
        }

        const chatMessage = {
          id: Date.now().toString(),
          user: socket.user.getPublicProfile(),
          message: message.trim(),
          type,
          timestamp: new Date(),
          roomId
        };

        // Broadcast message to all users in the room
        io.to(roomId).emit('new-message', chatMessage);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Start performance
    socket.on('start-performance', async (data) => {
      try {
        const { roomId, songId } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the host
        if (room.host.toString() !== socket.user._id.toString()) {
          socket.emit('error', { message: 'Only the host can start performances' });
          return;
        }

        // Check if there's already a performance in progress
        if (room.currentPerformance && room.currentPerformance.status === 'performing') {
          socket.emit('error', { message: 'A performance is already in progress' });
          return;
        }

        // Get next song from queue
        const nextSong = room.getNextSong();
        if (!nextSong) {
          socket.emit('error', { message: 'No songs in queue' });
          return;
        }

        // Start performance
        await room.startPerformance(nextSong.user, nextSong.song);

        // Broadcast to all users in the room
        io.to(roomId).emit('performance-started', {
          performance: room.currentPerformance,
          message: 'Performance started'
        });

      } catch (error) {
        console.error('Start performance error:', error);
        socket.emit('error', { message: 'Failed to start performance' });
      }
    });

    // End performance
    socket.on('end-performance', async (data) => {
      try {
        const { roomId } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the host
        if (room.host.toString() !== socket.user._id.toString()) {
          socket.emit('error', { message: 'Only the host can end performances' });
          return;
        }

        // End performance
        await room.endPerformance();

        // Broadcast to all users in the room
        io.to(roomId).emit('performance-ended', {
          performance: room.currentPerformance,
          message: 'Performance ended'
        });

      } catch (error) {
        console.error('End performance error:', error);
        socket.emit('error', { message: 'Failed to end performance' });
      }
    });

    // Update performance progress
    socket.on('performance-progress', (data) => {
      try {
        const { roomId, currentTime, lyricsIndex } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        // Broadcast to all users in the room (except sender)
        socket.to(roomId).emit('performance-progress-update', {
          currentTime,
          lyricsIndex,
          performer: socket.user.getPublicProfile()
        });

      } catch (error) {
        console.error('Performance progress error:', error);
        socket.emit('error', { message: 'Failed to update performance progress' });
      }
    });

    // Add song to queue
    socket.on('add-to-queue', async (data) => {
      try {
        const { roomId, songId, priority = 0 } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is in the room
        const participant = room.participants.find(p => 
          p.user.toString() === socket.user._id.toString() && p.isActive
        );

        if (!participant) {
          socket.emit('error', { message: 'You are not in this room' });
          return;
        }

        // Add to queue
        await room.addToQueue(socket.user._id, songId, priority);

        // Broadcast to all users in the room
        io.to(roomId).emit('queue-updated', {
          queue: room.queue,
          message: 'Queue updated'
        });

      } catch (error) {
        console.error('Add to queue error:', error);
        socket.emit('error', { message: 'Failed to add song to queue' });
      }
    });

    // Remove song from queue
    socket.on('remove-from-queue', async (data) => {
      try {
        const { roomId, queueIndex } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the host
        if (room.host.toString() !== socket.user._id.toString()) {
          socket.emit('error', { message: 'Only the host can remove songs from queue' });
          return;
        }

        // Remove from queue
        await room.removeFromQueue(queueIndex);

        // Broadcast to all users in the room
        io.to(roomId).emit('queue-updated', {
          queue: room.queue,
          message: 'Queue updated'
        });

      } catch (error) {
        console.error('Remove from queue error:', error);
        socket.emit('error', { message: 'Failed to remove song from queue' });
      }
    });

    // Send gift
    socket.on('send-gift', async (data) => {
      try {
        const { roomId, giftType, giftValue, recipientId } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if gifts are enabled
        if (!room.settings.enableGifts) {
          socket.emit('error', { message: 'Gifts are disabled in this room' });
          return;
        }

        // Check if user is in the room
        const participant = room.participants.find(p => 
          p.user.toString() === socket.user._id.toString() && p.isActive
        );

        if (!participant) {
          socket.emit('error', { message: 'You are not in this room' });
          return;
        }

        const gift = {
          id: Date.now().toString(),
          sender: socket.user.getPublicProfile(),
          recipient: recipientId,
          type: giftType,
          value: giftValue,
          timestamp: new Date(),
          roomId
        };

        // Broadcast gift to all users in the room
        io.to(roomId).emit('gift-sent', gift);

        // Update room stats
        room.stats.totalGifts += giftValue;
        await room.save();

      } catch (error) {
        console.error('Send gift error:', error);
        socket.emit('error', { message: 'Failed to send gift' });
      }
    });

    // Typing indicator
    socket.on('typing-start', (data) => {
      try {
        const { roomId } = data;
        
        if (!socket.user) return;

        socket.to(roomId).emit('user-typing', {
          user: socket.user.getPublicProfile(),
          isTyping: true
        });

      } catch (error) {
        console.error('Typing start error:', error);
      }
    });

    socket.on('typing-stop', (data) => {
      try {
        const { roomId } = data;
        
        if (!socket.user) return;

        socket.to(roomId).emit('user-typing', {
          user: socket.user.getPublicProfile(),
          isTyping: false
        });

      } catch (error) {
        console.error('Typing stop error:', error);
      }
    });

    // Disconnect handler
    socket.on('disconnect', async () => {
      try {
        console.log(`User disconnected: ${socket.user?.username || 'Anonymous'}`);

        if (socket.user) {
          // Update user's online status
          await socket.user.updateOnlineStatus(false);

          // Remove from connected users
          connectedUsers.delete(socket.user._id.toString());

          // Leave all rooms
          const userInfo = connectedUsers.get(socket.user._id.toString());
          if (userInfo) {
            userInfo.rooms.forEach(roomId => {
              socket.to(roomId).emit('user-left', {
                user: socket.user.getPublicProfile(),
                message: `${socket.user.displayName} disconnected`
              });
            });
          }
        }

        // Remove from room sockets
        roomSockets.forEach((sockets, roomId) => {
          if (sockets.has(socket.id)) {
            sockets.delete(socket.id);
            if (sockets.size === 0) {
              roomSockets.delete(roomId);
            }
          }
        });

      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });

  // Return utility functions
  return {
    getConnectedUsers: () => connectedUsers,
    getRoomSockets: () => roomSockets,
    emitToRoom: (roomId, event, data) => {
      io.to(roomId).emit(event, data);
    },
    emitToUser: (userId, event, data) => {
      const userInfo = connectedUsers.get(userId);
      if (userInfo) {
        io.to(userInfo.socketId).emit(event, data);
      }
    }
  };
};

module.exports = { setupSocketHandlers }; 