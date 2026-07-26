import 'package:flutter/material.dart';

enum AlertSeverity { critical, high, medium, low }

enum AlertStatus { open, investigating, resolved, falsePositive }

class AlertItem {
  final String id;
  final String title;
  final AlertSeverity severity;
  final String username;
  final String department;
  final int riskScore;
  final String metricHighlight;
  final String description;
  final DateTime timestamp;
  AlertStatus status;
  String? assignedTo;
  final List<String> linearChain; // e.g. ["JDOE (User)", "LAPTOP-SOC-99 (Device)", "192.168.1.105 (IP)", "Financial DB (Asset)"]
  final List<String> mitigationHistory;

  AlertItem({
    required this.id,
    required this.title,
    required this.severity,
    required this.username,
    required this.department,
    required this.riskScore,
    required this.metricHighlight,
    required this.description,
    required this.timestamp,
    this.status = AlertStatus.open,
    this.assignedTo,
    required this.linearChain,
    List<String>? mitigationHistory,
  }) : mitigationHistory = mitigationHistory ?? [];

  Color get severityColor {
    switch (severity) {
      case AlertSeverity.critical:
        return const Color(0xFFEF4444); // Red
      case AlertSeverity.high:
        return const Color(0xFFF97316); // Orange
      case AlertSeverity.medium:
        return const Color(0xFFF59E0B); // Amber
      case AlertSeverity.low:
        return const Color(0xFF10B981); // Emerald
    }
  }

  String get severityLabel {
    switch (severity) {
      case AlertSeverity.critical:
        return "CRITICAL";
      case AlertSeverity.high:
        return "HIGH";
      case AlertSeverity.medium:
        return "MEDIUM";
      case AlertSeverity.low:
        return "LOW";
    }
  }

  String get statusLabel {
    switch (status) {
      case AlertStatus.open:
        return "OPEN";
      case AlertStatus.investigating:
        return "INVESTIGATING";
      case AlertStatus.resolved:
        return "RESOLVED";
      case AlertStatus.falsePositive:
        return "FALSE POSITIVE";
    }
  }
}
