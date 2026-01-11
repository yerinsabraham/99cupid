import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// AppTheme - Application theme configuration
class AppTheme {
  // Colors
  static const Color cupidPink = AppColors.cupidPink;
  static const Color deepPlum = AppColors.deepPlum;
  static const Color warmBlush = AppColors.warmBlush;
  static const Color softIvory = AppColors.softIvory;

  // Theme Data
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: cupidPink,
      primary: cupidPink,
      secondary: deepPlum,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: softIvory,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      elevation: 0,
      iconTheme: IconThemeData(color: deepPlum),
      titleTextStyle: TextStyle(
        color: deepPlum,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),
    cardTheme: const CardThemeData(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: cupidPink,
        foregroundColor: Colors.white,
        elevation: 2,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: cupidPink, width: 2),
      ),
    ),
  );
}
