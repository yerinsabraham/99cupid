import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/constants/app_assets.dart';
import '../../../core/constants/firebase_collections.dart';

/// Splash Screen - Initial loading screen with logo
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNextScreen();
  }

  Future<void> _navigateToNextScreen() async {
    // Wait for a minimum time to show the splash screen
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    // Get current user directly from Firebase Auth (not from provider)
    // This ensures we get the actual current state after app reinstall
    final User? currentUser = FirebaseAuth.instance.currentUser;
    
    // Navigate based on auth state
    if (currentUser != null) {
      // Fetch user profile directly from Firestore to check profileSetupComplete
      try {
        final userDoc = await FirebaseFirestore.instance
            .collection(FirebaseCollections.users)
            .doc(currentUser.uid)
            .get();
        
        if (!mounted) return;
        
        if (userDoc.exists) {
          final profileComplete = userDoc.data()?['profileSetupComplete'] ?? false;
          
          if (profileComplete) {
            // User has completed onboarding, go to home
            context.go('/home');
          } else {
            // User needs to complete onboarding
            context.go('/onboarding/setup');
          }
        } else {
          // No user document, needs onboarding
          context.go('/onboarding/setup');
        }
      } catch (e) {
        debugPrint('Error checking profile: $e');
        // Default to onboarding on error
        context.go('/onboarding/setup');
      }
    } else {
      // No user logged in, go to login
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Main content - centered logo
            Expanded(
              child: Center(
                child: Image.asset(
                  AppAssets.logo,
                  width: 150,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            
            // App name at bottom
            Padding(
              padding: const EdgeInsets.only(bottom: 48.0),
              child: Text(
                '99cupid',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.black.withValues(alpha: 0.6),
                  letterSpacing: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
