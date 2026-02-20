/**
 * CulturalGame - Represents a cultural exchange game session
 */
export class CulturalGame {
  constructor(data = {}) {
    this.id = data.id || '';
    this.gameType = data.gameType || 'learn_connect'; // 'learn_connect' | 'teach_phrase' | 'compatibility_quiz' | 'red_flag_green_flag'
    this.matchId = data.matchId || '';
    this.player1Id = data.player1Id || '';
    this.player2Id = data.player2Id || '';
    
    this.status = data.status || 'pending'; // 'pending' | 'in_progress' | 'completed'
    
    // Game-specific data
    this.questions = data.questions || [];
    
    // Results
    this.player1Score = data.player1Score || 0;
    this.player2Score = data.player2Score || 0;
    this.culturalCompatibility = data.culturalCompatibility || 0; // 0-100
    
    this.completedAt = data.completedAt || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  /**
   * Convert to Firestore format
   */
  toFirestore() {
    return {
      id: this.id,
      gameType: this.gameType,
      matchId: this.matchId,
      player1Id: this.player1Id,
      player2Id: this.player2Id,
      status: this.status,
      questions: this.questions,
      player1Score: this.player1Score,
      player2Score: this.player2Score,
      culturalCompatibility: this.culturalCompatibility,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
    };
  }

  /**
   * Create from Firestore document
   */
  static fromFirestore(doc) {
    if (!doc.exists) return null;
    return new CulturalGame({ id: doc.id, ...doc.data() });
  }

  /**
   * Add question to game
   */
  addQuestion(question) {
    this.questions.push({
      questionId: Date.now().toString(),
      askedBy: question.askedBy,
      category: question.category,
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      player1Answer: null,
      player2Answer: null,
      answeredAt: [],
    });
    return this;
  }

  /**
   * Submit answer for a player
   */
  submitAnswer(questionId, playerId, answer) {
    const question = this.questions.find(q => q.questionId === questionId);
    if (!question) return false;

    if (playerId === this.player1Id) {
      question.player1Answer = answer;
      question.answeredAt[0] = new Date().toISOString();
      if (answer === question.correctAnswer) this.player1Score++;
    } else if (playerId === this.player2Id) {
      question.player2Answer = answer;
      question.answeredAt[1] = new Date().toISOString();
      if (answer === question.correctAnswer) this.player2Score++;
    }

    // Check if game is complete
    if (this.isComplete()) {
      this.status = 'completed';
      this.completedAt = new Date().toISOString();
      this.calculateCompatibility();
    }

    return true;
  }

  /**
   * Check if all questions are answered
   */
  isComplete() {
    return this.questions.every(q => q.player1Answer && q.player2Answer);
  }

  /**
   * Calculate cultural compatibility score
   */
  calculateCompatibility() {
    const totalQuestions = this.questions.length;
    if (totalQuestions === 0) {
      this.culturalCompatibility = 0;
      return;
    }

    // Base score on how many questions both got right
    const avgScore = (this.player1Score + this.player2Score) / (2 * totalQuestions);
    this.culturalCompatibility = Math.round(avgScore * 100);
  }
}
