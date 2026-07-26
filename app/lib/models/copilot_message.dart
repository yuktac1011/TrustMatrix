class CopilotMessage {
  final String id;
  final String text;
  final bool isUser;
  final DateTime timestamp;
  final List<String>? mitreTags;
  final List<String>? playbooks;

  CopilotMessage({
    required this.id,
    required this.text,
    required this.isUser,
    required this.timestamp,
    this.mitreTags,
    this.playbooks,
  });
}
