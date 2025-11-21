/**
 * Match Model
 * Represents a mutual match between two users
 */
export class MatchModel {
  constructor(data = {}) {
    this.matchId = data.matchId || '';
    this.user1Id = data.user1Id || '';
    this.user2Id = data.user2Id || '';
    this.user1Name = data.user1Name || '';
    this.user2Name = data.user2Name || '';
    this.user1Photo = data.user1Photo || '';
    this.user2Photo = data.user2Photo || '';
    this.chatId = data.chatId || '';
    this.matchedAt = data.matchedAt || new Date().toISOString();
    this.lastMessageAt = data.lastMessageAt || null;
    this.lastMessage = data.lastMessage || '';
    this.unreadCount = data.unreadCount || 0;
  }

  toFirestore() {
    return {
      user1Id: this.user1Id,
      user2Id: this.user2Id,
      user1Name: this.user1Name,
      user2Name: this.user2Name,
      user1Photo: this.user1Photo,
      user2Photo: this.user2Photo,
      chatId: this.chatId,
      matchedAt: this.matchedAt,
      lastMessageAt: this.lastMessageAt,
      lastMessage: this.lastMessage,
      unreadCount: this.unreadCount,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new MatchModel({
      ...data,
      matchId: doc.id,
    });
  }
}

/**
 * Message Model
 * Represents a chat message
 */
export class MessageModel {
  constructor(data = {}) {
    this.messageId = data.messageId || '';
    this.chatId = data.chatId || '';
    this.senderId = data.senderId || '';
    this.senderName = data.senderName || '';
    this.receiverId = data.receiverId || '';
    this.text = data.text || '';
    this.imageUrl = data.imageUrl || null;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.read = data.read || false;
    this.delivered = data.delivered || false;
  }

  toFirestore() {
    return {
      chatId: this.chatId,
      senderId: this.senderId,
      senderName: this.senderName,
      receiverId: this.receiverId,
      text: this.text,
      imageUrl: this.imageUrl,
      timestamp: this.timestamp,
      read: this.read,
      delivered: this.delivered,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new MessageModel({
      ...data,
      messageId: doc.id,
    });
  }
}

/**
 * Verification Model
 * Represents a verification request
 */
export class VerificationModel {
  constructor(data = {}) {
    this.verificationId = data.verificationId || '';
    this.userId = data.userId || '';
    this.selfieUrl = data.selfieUrl || '';
    this.status = data.status || 'pending'; // 'pending', 'approved', 'rejected'
    this.submittedAt = data.submittedAt || new Date().toISOString();
    this.reviewedAt = data.reviewedAt || null;
    this.reviewedBy = data.reviewedBy || null;
    this.rejectionReason = data.rejectionReason || '';
  }

  toFirestore() {
    return {
      userId: this.userId,
      selfieUrl: this.selfieUrl,
      status: this.status,
      submittedAt: this.submittedAt,
      reviewedAt: this.reviewedAt,
      reviewedBy: this.reviewedBy,
      rejectionReason: this.rejectionReason,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new VerificationModel({
      ...data,
      verificationId: doc.id,
    });
  }
}

/**
 * Report Model
 * Represents a user report
 */
export class ReportModel {
  constructor(data = {}) {
    this.reportId = data.reportId || '';
    this.reporterId = data.reporterId || '';
    this.reportedUserId = data.reportedUserId || '';
    this.reason = data.reason || '';
    this.description = data.description || '';
    this.status = data.status || 'pending'; // 'pending', 'reviewed', 'resolved'
    this.createdAt = data.createdAt || new Date().toISOString();
    this.reviewedAt = data.reviewedAt || null;
  }

  toFirestore() {
    return {
      reporterId: this.reporterId,
      reportedUserId: this.reportedUserId,
      reason: this.reason,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      reviewedAt: this.reviewedAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new ReportModel({
      ...data,
      reportId: doc.id,
    });
  }
}
