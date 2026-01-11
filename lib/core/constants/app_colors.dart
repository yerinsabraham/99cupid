import 'package:flutter/material.dart';

/// App Color Palette
/// Based on the existing web app theme
class AppColors {
  // Primary brand colors
  static const Color cupidPink = Color(0xFFFF5FA8);
  static const Color deepPlum = Color(0xFF3D1A4D);
  static const Color warmBlush = Color(0xFFFCE8F1);
  static const Color softIvory = Color(0xFFFFF8FA);
  
  // Functional colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);
  
  // Neutral colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color grey50 = Color(0xFFF9FAFB);
  static const Color grey100 = Color(0xFFF3F4F6);
  static const Color grey200 = Color(0xFFE5E7EB);
  static const Color grey300 = Color(0xFFD1D5DB);
  static const Color grey400 = Color(0xFF9CA3AF);
  static const Color grey500 = Color(0xFF6B7280);
  static const Color grey600 = Color(0xFF4B5563);
  static const Color grey700 = Color(0xFF374151);
  static const Color grey800 = Color(0xFF1F2937);
  static const Color grey900 = Color(0xFF111827);
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [cupidPink, deepPlum],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient backgroundGradient = LinearGradient(
    colors: [warmBlush, softIvory],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
