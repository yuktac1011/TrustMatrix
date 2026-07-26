class AnomalyTimelineEvent {
  final String time;
  final String title;
  final String details;
  final int score;

  AnomalyTimelineEvent({
    required this.time,
    required this.title,
    required this.details,
    required this.score,
  });
}

class EntityProfile {
  final String username;
  final String fullName;
  final String role;
  final String department;
  final int riskScore;
  final int peerAvgRisk;
  final String baselineHours;
  final String dailyBytesLimit;
  final List<String> authorizedDevices;
  final List<String> linearChain;
  final List<AnomalyTimelineEvent> recentAnomalies;

  EntityProfile({
    required this.username,
    required this.fullName,
    required this.role,
    required this.department,
    required this.riskScore,
    required this.peerAvgRisk,
    required this.baselineHours,
    required this.dailyBytesLimit,
    required this.authorizedDevices,
    required this.linearChain,
    required this.recentAnomalies,
  });
}
