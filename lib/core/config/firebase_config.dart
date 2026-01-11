import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Firebase configuration
/// Uses environment variables from .env file
class FirebaseConfig {
  static Future<void> initialize() async {
    // Load environment variables
    await dotenv.load(fileName: '.env');
    
    // Check if Firebase is already initialized
    if (Firebase.apps.isNotEmpty) {
      if (kDebugMode) {
        print('✅ Firebase already initialized');
      }
      return;
    }
    
    // Firebase options from environment
    final firebaseOptions = FirebaseOptions(
      apiKey: dotenv.env['FIREBASE_API_KEY'] ?? '',
      authDomain: dotenv.env['FIREBASE_AUTH_DOMAIN'] ?? '',
      projectId: dotenv.env['FIREBASE_PROJECT_ID'] ?? '',
      storageBucket: dotenv.env['FIREBASE_STORAGE_BUCKET'] ?? '',
      messagingSenderId: dotenv.env['FIREBASE_MESSAGING_SENDER_ID'] ?? '',
      appId: dotenv.env['FIREBASE_APP_ID'] ?? '',
      iosBundleId: 'com.cupid99.cupid99',
    );
    
    // Validate configuration
    _validateConfig(firebaseOptions);
    
    // Initialize Firebase
    await Firebase.initializeApp(options: firebaseOptions);
    
    if (kDebugMode) {
      print('✅ Firebase initialized successfully');
    }
  }
  
  static void _validateConfig(FirebaseOptions options) {
    final requiredFields = {
      'apiKey': options.apiKey,
      'authDomain': options.authDomain,
      'projectId': options.projectId,
      'storageBucket': options.storageBucket,
      'messagingSenderId': options.messagingSenderId,
      'appId': options.appId,
    };
    
    final missingFields = requiredFields.entries
        .where((entry) => (entry.value ?? '').isEmpty)
        .map((entry) => entry.key)
        .toList();
    
    if (missingFields.isNotEmpty) {
      throw Exception(
        'Missing Firebase configuration: ${missingFields.join(', ')}\n'
        'Please ensure all FIREBASE_* variables are set in .env file'
      );
    }
  }
}
