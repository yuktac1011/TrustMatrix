import 'package:flutter/material.dart';

class BiometricService extends ChangeNotifier {
  static final BiometricService _instance = BiometricService._internal();
  factory BiometricService() => _instance;
  BiometricService._internal();

  bool _isLocked = true;
  bool _biometricEnabled = true;
  String _pinCode = "1234";

  bool get isLocked => _isLocked;
  bool get biometricEnabled => _biometricEnabled;

  void lockApp() {
    _isLocked = true;
    notifyListeners();
  }

  bool authenticateWithBiometrics() {
    // Simulated FaceID / TouchID scan
    _isLocked = false;
    notifyListeners();
    return true;
  }

  bool authenticateWithPIN(String pin) {
    if (pin == _pinCode) {
      _isLocked = false;
      notifyListeners();
      return true;
    }
    return false;
  }

  void toggleBiometrics(bool enabled) {
    _biometricEnabled = enabled;
    notifyListeners();
  }
}
