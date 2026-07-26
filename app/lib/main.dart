import 'package:flutter/material.dart';
import 'services/biometric_service.dart';
import 'screens/biometric_auth_screen.dart';
import 'screens/main_navigation_screen.dart';

void main() {
  runApp(const TrustMatrixApp());
}

class TrustMatrixApp extends StatelessWidget {
  const TrustMatrixApp({super.key});

  @override
  Widget build(BuildContext context) {
    final bioService = BiometricService();

    return MaterialApp(
      title: 'TrustMatrix SOC',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF09090B),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF7C3AED),
          secondary: Color(0xFF06B6D4),
          surface: Color(0xFF12131A),
          error: Color(0xFFEF4444),
        ),
        fontFamily: 'Roboto',
        useMaterial3: true,
      ),
      home: ListenableBuilder(
        listenable: bioService,
        builder: (context, _) {
          if (bioService.isLocked) {
            return const BiometricAuthScreen();
          }
          return const MainNavigationScreen();
        },
      ),
    );
  }
}
