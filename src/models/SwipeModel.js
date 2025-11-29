/**
 * SwipeModel - Represents a swipe action (like or pass)
 */
export class SwipeModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.targetUserId = data.targetUserId || '';
    this.direction = data.direction || 'left'; // 'left' (pass) or 'right' (like)
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  toFirestore() {
    return {
      userId: this.userId,
      targetUserId: this.targetUserId,
      direction: this.direction,
      timestamp: this.timestamp,
    };
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null;
    const data = doc.data();
    return new SwipeModel({
      id: doc.id,
      ...data,
    });
  }
}

/**
 * LikeModel - Represents a like (mutual interest tracking)
 */
export class LikeModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.fromUserId = data.fromUserId || '';
    this.toUserId = data.toUserId || '';
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  toFirestore() {
    return {
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
      timestamp: this.timestamp,
    };
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null;
    const data = doc.data();
    return new LikeModel({
      id: doc.id,
      ...data,
    });
  }
}

/**
 * MatchModel - Represents a mutual match
 */
export class MatchModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.user1Id = data.user1Id || '';
    this.user2Id = data.user2Id || '';
    this.user1Name = data.user1Name || '';
    this.user2Name = data.user2Name || '';
    this.user1Photo = data.user1Photo || null;
    this.user2Photo = data.user2Photo || null;
    this.matchedAt = data.matchedAt || new Date().toISOString();
    this.chatId = data.chatId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  toFirestore() {
    return {
      user1Id: this.user1Id,
      user2Id: this.user2Id,
      user1Name: this.user1Name,
      user2Name: this.user2Name,
      user1Photo: this.user1Photo,
      user2Photo: this.user2Photo,
      matchedAt: this.matchedAt,
      chatId: this.chatId,
      createdAt: this.createdAt,
    };
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null;
    const data = doc.data();
    return new MatchModel({
      id: doc.id,
      ...data,
    });
  }

  getOtherUserId(currentUserId) {
    return this.user1Id === currentUserId ? this.user2Id : this.user1Id;
  }

  getOtherUserName(currentUserId) {
    return this.user1Id === currentUserId ? this.user2Name : this.user1Name;
  }

  getOtherUserPhoto(currentUserId) {
    return this.user1Id === currentUserId ? this.user2Photo : this.user1Photo;
  }
}
