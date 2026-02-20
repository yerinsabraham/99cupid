import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CulturalGame } from '../models/CulturalGame';

/**
 * CulturalGamesService - Manages cultural exchange games
 */
class CulturalGamesService {
  /**
   * Create a new game
   */
  async createGame(matchId, gameType, player1Id, player2Id) {
    try {
      const gamesRef = collection(db, 'cultural_games');
      const game = new CulturalGame({
        matchId,
        gameType,
        player1Id,
        player2Id,
        status: 'pending'
      });
      
      const docRef = await addDoc(gamesRef, game.toFirestore());
      game.id = docRef.id;
      
      return { success: true, gameId: docRef.id, game };
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  /**
   * Get active games for a user
   */
  async getActiveGames(userId) {
    try {
      const gamesRef = collection(db, 'cultural_games');
      const q1 = query(
        gamesRef,
        where('player1Id', '==', userId),
        where('status', 'in', ['pending', 'in_progress'])
      );
      const q2 = query(
        gamesRef,
        where('player2Id', '==', userId),
        where('status', 'in', ['pending', 'in_progress'])
      );
      
      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);
      
      const games = [];
      snapshot1.forEach(doc => {
        games.push(CulturalGame.fromFirestore(doc));
      });
      snapshot2.forEach(doc => {
        games.push(CulturalGame.fromFirestore(doc));
      });
      
      return games;
    } catch (error) {
      console.error('Error getting active games:', error);
      throw error;
    }
  }

  /**
   * Get game by ID
   */
  async getGameById(gameId) {
    try {
      const gameRef = doc(db, 'cultural_games', gameId);
      const gameDoc = await getDoc(gameRef);
      
      if (!gameDoc.exists()) {
        return null;
      }
      
      return CulturalGame.fromFirestore(gameDoc);
    } catch (error) {
      console.error('Error getting game:', error);
      throw error;
    }
  }

  /**
   * Submit an answer to a question
   */
  async submitAnswer(gameId, userId, questionId, answer) {
    try {
      const game = await this.getGameById(gameId);
      if (!game) {
        throw new Error('Game not found');
      }
      
      game.submitAnswer(questionId, userId, answer);
      
      const gameRef = doc(db, 'cultural_games', gameId);
      await updateDoc(gameRef, game.toFirestore());
      
      return { success: true, game };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  /**
   * Complete a game (mark as finished)
   */
  async completeGame(gameId) {
    try {
      const game = await this.getGameById(gameId);
      if (!game) {
        throw new Error('Game not found');
      }
      
      game.status = 'completed';
      game.completedAt = new Date().toISOString();
      game.calculateCompatibility();
      
      const gameRef = doc(db, 'cultural_games', gameId);
      await updateDoc(gameRef, game.toFirestore());
      
      // Update player stats
      await this.updatePlayerStats(game.player1Id, game);
      await this.updatePlayerStats(game.player2Id, game);
      
      return { success: true, game };
    } catch (error) {
      console.error('Error completing game:', error);
      throw error;
    }
  }

  /**
   * Update player game statistics
   */
  async updatePlayerStats(userId, game) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return;
      
      const userData = userDoc.data();
      const gamesPlayed = (userData.gamesPlayed || 0) + 1;
      const won = (userId === game.player1Id && game.player1Score > game.player2Score) ||
                  (userId === game.player2Id && game.player2Score > game.player1Score);
      const gamesWon = won ? (userData.gamesWon || 0) + 1 : (userData.gamesWon || 0);
      
      await updateDoc(userRef, {
        gamesPlayed,
        gamesWon,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating player stats:', error);
    }
  }

  /**
   * Get question templates for a game type
   */
  getQuestionTemplates(gameType, country = null) {
    // This would eventually come from Firestore, but for now return static questions
    const templates = {
      learn_connect: this.getLearnConnectQuestions(country),
      red_flag_green_flag: this.getRedFlagQuestions(),
      compatibility_quiz: this.getCompatibilityQuestions()
    };
    
    return templates[gameType] || [];
  }

  /**
   * Learn & Connect questions by country
   */
  getLearnConnectQuestions(country) {
    const questionBank = {
      Philippines: [
        {
          questionText: 'What ingredient combination makes Filipino adobo unique?',
          options: ['Soy sauce only', 'Vinegar only', 'Soy sauce + Vinegar', 'Tomato sauce'],
          correctAnswer: 'Soy sauce + Vinegar',
          explanation: 'Adobo\'s signature taste comes from the combination of soy sauce and vinegar, creating a perfect balance of savory and tangy flavors.',
          category: 'food'
        },
        {
          questionText: 'What does "Salamat" mean in Tagalog?',
          options: ['Hello', 'Thank you', 'Goodbye', 'Welcome'],
          correctAnswer: 'Thank you',
          explanation: 'Salamat is the Tagalog word for "thank you" - one of the most important words to know!',
          category: 'language'
        },
        {
          questionText: 'What is the traditional Filipino breakfast dish made of fried rice, egg, and meat?',
          options: ['Pancit', 'Silog', 'Lumpia', 'Sinigang'],
          correctAnswer: 'Silog',
          explanation: 'Silog refers to meals combining sinangag (fried rice) and itlog (egg), like tapsilog, longsilog, or tocilog.',
          category: 'food'
        }
      ],
      Canada: [
        {
          questionText: 'What are the three main ingredients in poutine?',
          options: ['Fries + Ketchup + Mayo', 'Fries + Gravy + Cheese curds', 'Fries + Bacon + Cheese', 'Fries + Sour cream + Onions'],
          correctAnswer: 'Fries + Gravy + Cheese curds',
          explanation: 'Poutine is a Canadian classic made with french fries, brown gravy, and cheese curds - a perfect comfort food!',
          category: 'food'
        },
        {
          questionText: 'What does "eh" mean in Canadian slang?',
          options: ['A question tag', 'An expression of surprise', 'Both of the above', 'None'],
          correctAnswer: 'Both of the above',
          explanation: 'Canadians use "eh" both to turn statements into questions ("Nice day, eh?") and to express surprise or agreement.',
          category: 'language'
        },
        {
          questionText: 'Which sport did Canada invent?',
          options: ['Ice hockey', 'Basketball', 'Both', 'Neither'],
          correctAnswer: 'Both',
          explanation: 'Canada invented ice hockey, and Canadian James Naismith invented basketball in 1891!',
          category: 'history'
        }
      ],
      India: [
        {
          questionText: 'What is the festival of lights called in India?',
          options: ['Holi', 'Diwali', 'Eid', 'Navratri'],
          correctAnswer: 'Diwali',
          explanation: 'Diwali, the festival of lights, celebrates the victory of light over darkness and good over evil.',
          category: 'tradition'
        },
        {
          questionText: 'What does "Namaste" literally mean?',
          options: ['Hello', 'I bow to you', 'Goodbye', 'Welcome'],
          correctAnswer: 'I bow to you',
          explanation: 'Namaste comes from Sanskrit meaning "I bow to the divine in you" - a respectful greeting.',
          category: 'language'
        },
        {
          questionText: 'What type of bread is naan?',
          options: ['Fried bread', 'Flatbread', 'Sweet bread', 'Steamed bread'],
          correctAnswer: 'Flatbread',
          explanation: 'Naan is a leavened flatbread traditionally cooked in a tandoor (clay oven).',
          category: 'food'
        }
      ],
      USA: [
        {
          questionText: 'What is the traditional American Thanksgiving main dish?',
          options: ['Ham', 'Turkey', 'Roast beef', 'Chicken'],
          correctAnswer: 'Turkey',
          explanation: 'Turkey is the centerpiece of most American Thanksgiving dinners, often served with stuffing and cranberry sauce.',
          category: 'tradition'
        },
        {
          questionText: 'What does "y\'all" mean in Southern US dialect?',
          options: ['Yes, all', 'You all', 'Your all', 'Yeah, alright'],
          correctAnswer: 'You all',
          explanation: 'Y\'all is a contraction of "you all" commonly used in the Southern United States.',
          category: 'language'
        },
        {
          questionText: 'Which city is known as the "Big Apple"?',
          options: ['Los Angeles', 'Chicago', 'New York City', 'Boston'],
          correctAnswer: 'New York City',
          explanation: 'New York City has been nicknamed the "Big Apple" since the 1920s.',
          category: 'culture'
        }
      ]
    };
    
    return questionBank[country] || [];
  }

  /**
   * Red Flag or Green Flag scenarios
   */
  getRedFlagQuestions() {
    return [
      {
        scenario: 'Shows up 20 minutes late to first date without calling',
        category: 'punctuality'
      },
      {
        scenario: 'Still best friends with their ex from 3 years ago',
        category: 'past_relationships'
      },
      {
        scenario: 'Very close with family - talks to them daily',
        category: 'family'
      },
      {
        scenario: 'Has never been in a relationship before',
        category: 'experience'
      },
      {
        scenario: 'Extremely busy with work - 60+ hour weeks',
        category: 'lifestyle'
      },
      {
        scenario: 'Very active on social media - posts daily',
        category: 'social_media'
      },
      {
        scenario: 'Wants kids within 2 years',
        category: 'future_plans'
      },
      {
        scenario: 'Doesn\'t want to get married',
        category: 'commitment'
      },
      {
        scenario: 'Splits every bill exactly 50/50',
        category: 'finances'
      },
      {
        scenario: 'Jealous type - wants to know where you are',
        category: 'trust'
      }
    ];
  }

  /**
   * Compatibility quiz questions
   */
  getCompatibilityQuestions() {
    return {
      love_language: [
        {
          question: 'How do you prefer to show love?',
          options: ['Words of affirmation', 'Quality time', 'Physical touch', 'Acts of service', 'Gifts']
        },
        {
          question: 'How do you like to receive love?',
          options: ['Compliments and encouragement', 'Undivided attention', 'Hugs and kisses', 'Help with tasks', 'Thoughtful presents']
        }
      ],
      travel_style: [
        {
          question: 'Your ideal vacation is:',
          options: ['Backpacking adventure', 'Luxury resort', 'Cultural exploration', 'Beach relaxation', 'Road trip']
        },
        {
          question: 'When traveling, you prefer:',
          options: ['Detailed itinerary', 'Loose plan', 'Spontaneous decisions', 'Going with the flow']
        }
      ],
      communication: [
        {
          question: 'When there\'s a problem, you:',
          options: ['Talk about it immediately', 'Need time to think first', 'Avoid conflict', 'Seek compromise']
        },
        {
          question: 'Your communication style is:',
          options: ['Direct and honest', 'Diplomatic and careful', 'Emotional and expressive', 'Logical and analytical']
        }
      ]
    };
  }

  /**
   * Calculate cultural compatibility score
   */
  calculateCulturalCompatibility(game) {
    const totalQuestions = game.questions.length;
    if (totalQuestions === 0) return 0;
    
    const avgScore = (game.player1Score + game.player2Score) / (2 * totalQuestions);
    return Math.round(avgScore * 100);
  }

  /**
   * Award badge to user
   */
  async awardBadge(userId, badgeType) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return;
      
      const userData = userDoc.data();
      const badges = userData.culturalBadges || [];
      
      // Check if badge already exists
      if (badges.some(b => b.badgeId === badgeType)) {
        return { success: false, message: 'Badge already earned' };
      }
      
      badges.push({
        badgeId: badgeType,
        name: this.getBadgeName(badgeType),
        earnedAt: new Date().toISOString()
      });
      
      await updateDoc(userRef, {
        culturalBadges: badges,
        updatedAt: serverTimestamp()
      });
      
      return { success: true, badge: badges[badges.length - 1] };
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }

  /**
   * Get badge name from badge type
   */
  getBadgeName(badgeType) {
    const names = {
      'first_game': 'Cultural Explorer 🌍',
      'five_games': 'World Traveler ✈️',
      'ten_games': 'Cultural Ambassador 🎓',
      'high_score': 'Culture Master 🏆',
      'polyglot': 'Language Learner 💬',
      'food_expert': 'Foodie Explorer 🍜'
    };
    return names[badgeType] || 'Achievement Unlocked';
  }
}

// Export singleton instance
export const culturalGamesService = new CulturalGamesService();
export default culturalGamesService;
