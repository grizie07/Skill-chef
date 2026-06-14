import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface UserSocketMap {
  [userId: string]: string; // Maps userId to socketId
}

export class SocketService {
  private static io: SocketIOServer | null = null;
  private static onlineUsers: UserSocketMap = {};

  public static init(server: HTTPServer): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', // For development, allow all origins
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Register User
      socket.on('register_user', (userId: string) => {
        if (userId) {
          this.onlineUsers[userId] = socket.id;
          console.log(`User ${userId} registered with socket ${socket.id}`);
          
          // Broadcast updated online list if needed
          this.io?.emit('online_users', Object.keys(this.onlineUsers));
        }
      });

      // Join Recipe Room (for real-time comments and reviews)
      socket.on('join_recipe', (recipeId: string) => {
        socket.join(`recipe_${recipeId}`);
        console.log(`Socket ${socket.id} joined recipe room: recipe_${recipeId}`);
      });

      // Leave Recipe Room
      socket.on('leave_recipe', (recipeId: string) => {
        socket.leave(`recipe_${recipeId}`);
        console.log(`Socket ${socket.id} left recipe room: recipe_${recipeId}`);
      });

      // Typing Indicator
      socket.on('typing', (data: { senderId: string; receiverId: string; isTyping: boolean }) => {
        const receiverSocketId = this.onlineUsers[data.receiverId];
        if (receiverSocketId) {
          socket.to(receiverSocketId).emit('typing_status', {
            senderId: data.senderId,
            isTyping: data.isTyping
          });
        }
      });

      // Chat message check (sent manually or handled via controller)
      // Disconnect
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        // Remove from online mapping
        const userId = Object.keys(this.onlineUsers).find(key => this.onlineUsers[key] === socket.id);
        if (userId) {
          delete this.onlineUsers[userId];
          console.log(`User ${userId} deregistered`);
          this.io?.emit('online_users', Object.keys(this.onlineUsers));
        }
      });
    });

    return this.io;
  }

  /**
   * Pushes a real-time notification to a specific user if online
   */
  public static sendNotification(receiverId: string, notification: any): void {
    if (!this.io) return;
    const socketId = this.onlineUsers[receiverId];
    if (socketId) {
      this.io.to(socketId).emit('new_notification', notification);
      console.log(`Realtime notification pushed to user ${receiverId}`);
    }
  }

  /**
   * Pushes a chat message to a recipient
   */
  public static sendDirectMessage(receiverId: string, message: any): void {
    if (!this.io) return;
    const socketId = this.onlineUsers[receiverId];
    if (socketId) {
      this.io.to(socketId).emit('new_message', message);
      console.log(`Realtime direct message pushed to user ${receiverId}`);
    }
  }

  /**
   * Broadcast comments to room
   */
  public static broadcastComment(recipeId: string, comment: any): void {
    if (!this.io) return;
    this.io.to(`recipe_${recipeId}`).emit('new_comment', comment);
    console.log(`Broadcasted new comment to room: recipe_${recipeId}`);
  }
}
