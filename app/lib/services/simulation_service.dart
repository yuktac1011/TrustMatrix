import 'dart:async';
import 'package:flutter/material.dart';
import '../models/alert_item.dart';
import '../models/entity_profile.dart';
import '../models/copilot_message.dart';

class SOARAuditEntry {
  final String id;
  final String action;
  final String target;
  final String analyst;
  final DateTime timestamp;
  final String status;

  SOARAuditEntry({
    required this.id,
    required this.action,
    required this.target,
    required this.analyst,
    required this.timestamp,
    this.status = "EXECUTED (SUCCESS)",
  });
}

class SimulationService extends ChangeNotifier {
  static final SimulationService _instance = SimulationService._internal();
  factory SimulationService() => _instance;
  SimulationService._internal() {
    _initSampleData();
  }

  int _orgRiskScore = 78;
  int _monitoredEntitiesCount = 1420;
  int _activeIsolationsCount = 3;

  AlertItem? _latestPushedAlert;

  final List<AlertItem> _alerts = [];
  final List<EntityProfile> _entities = [];
  final List<CopilotMessage> _copilotMessages = [];
  final List<SOARAuditEntry> _soarAuditLog = [];

  int get orgRiskScore => _orgRiskScore;
  int get monitoredEntitiesCount => _monitoredEntitiesCount;
  int get activeIsolationsCount => _activeIsolationsCount;
  AlertItem? get latestPushedAlert => _latestPushedAlert;

  List<AlertItem> get alerts => List.unmodifiable(_alerts);
  List<EntityProfile> get entities => List.unmodifiable(_entities);
  List<CopilotMessage> get copilotMessages => List.unmodifiable(_copilotMessages);
  List<SOARAuditEntry> get soarAuditLog => List.unmodifiable(_soarAuditLog);

  List<AlertItem> get criticalAlerts =>
      _alerts.where((a) => a.severity == AlertSeverity.critical || a.severity == AlertSeverity.high).toList();

  List<EntityProfile> get topAnomalousEntities {
    final copy = List<EntityProfile>.from(_entities);
    copy.sort((a, b) => b.riskScore.compareTo(a.riskScore));
    return copy.take(5).toList();
  }

  void clearLatestPushedAlert() {
    _latestPushedAlert = null;
    notifyListeners();
  }

  void _initSampleData() {
    // Initial Alerts
    _alerts.addAll([
      AlertItem(
        id: "ALT-492",
        title: "Massive Data Exfiltration via Encrypted Tunnel",
        severity: AlertSeverity.critical,
        username: "jdoe",
        department: "Finance & Accounting",
        riskScore: 94,
        metricHighlight: "85,000 KB transferred (320% above baseline)",
        description: "User jdoe initiated high-volume file transfers to unrecognized external IP 198.51.100.44 outside standard business hours (3:15 AM).",
        timestamp: DateTime.now().subtract(const Duration(minutes: 12)),
        linearChain: ["jdoe (User)", "FIN-LAPTOP-04 (Device)", "198.51.100.44 (External IP)", "Financial Ledger DB (Asset)"],
      ),
      AlertItem(
        id: "ALT-489",
        title: "Unusual Privilege Escalation & Admin Commands",
        severity: AlertSeverity.high,
        username: "admin_user",
        department: "IT Infrastructure",
        riskScore: 86,
        metricHighlight: "8 sudo admin commands in 2 mins",
        description: "Multiple administrative group modifications detected from host LAPTOP-SOC-99 at 2:40 AM.",
        timestamp: DateTime.now().subtract(const Duration(hours: 1, minutes: 45)),
        linearChain: ["admin_user (User)", "LAPTOP-SOC-99 (Device)", "192.168.1.105 (Internal IP)", "Active Directory Domain Controller (Asset)"],
      ),
      AlertItem(
        id: "ALT-475",
        title: "VPN Access from Impossible Geographic Location",
        severity: AlertSeverity.high,
        username: "msmith",
        department: "Engineering",
        riskScore: 82,
        metricHighlight: "Login from Frankfurt 10m after Tokyo login",
        description: "Simultaneous active sessions detected across geographically impossible distances without registered travel clearance.",
        timestamp: DateTime.now().subtract(const Duration(hours: 3, minutes: 20)),
        linearChain: ["msmith (User)", "DEV-RIG-01 (Device)", "203.0.113.88 (VPN Gateway)", "Core GitHub Repo (Asset)"],
      ),
      AlertItem(
        id: "ALT-460",
        title: "Unmanaged Shadow Account Creation",
        severity: AlertSeverity.medium,
        username: "svc_backup_temp",
        department: "DevOps",
        riskScore: 68,
        metricHighlight: "Orphaned service account with domain admin rights",
        description: "New local administrator account created without approval ticket in ITSM system.",
        timestamp: DateTime.now().subtract(const Duration(hours: 5)),
        linearChain: ["svc_backup_temp (Service Acct)", "SRV-DB-02 (Server)", "10.0.4.12 (Internal IP)", "Backup Storage Bucket (Asset)"],
      ),
    ]);

    // Initial Entity Profiles
    _entities.addAll([
      EntityProfile(
        username: "jdoe",
        fullName: "John Doe",
        role: "Senior Financial Analyst",
        department: "Finance & Accounting",
        riskScore: 94,
        peerAvgRisk: 22,
        baselineHours: "08:00 AM - 05:30 PM",
        dailyBytesLimit: "250,000 KB (Current: 850,000 KB)",
        authorizedDevices: ["FIN-LAPTOP-04", "FIN-DESKTOP-12"],
        linearChain: ["jdoe (User)", "FIN-LAPTOP-04 (Device)", "198.51.100.44 (IP)", "Financial Ledger DB (Asset)"],
        recentAnomalies: [
          AnomalyTimelineEvent(time: "03:15 AM", title: "Off-hours Data Transfer", details: "Transferred 85,000 KB to unknown external IP", score: 94),
          AnomalyTimelineEvent(time: "02:50 AM", title: "VPN Gateway Session", details: "Authenticated via emergency VPN pool", score: 76),
        ],
      ),
      EntityProfile(
        username: "admin_user",
        fullName: "Alice Vance",
        role: "Lead Systems Engineer",
        department: "IT Infrastructure",
        riskScore: 86,
        peerAvgRisk: 34,
        baselineHours: "09:00 AM - 06:00 PM",
        dailyBytesLimit: "1,000,000 KB (Current: 420,000 KB)",
        authorizedDevices: ["LAPTOP-SOC-99", "BASTION-HOST-01"],
        linearChain: ["admin_user (User)", "LAPTOP-SOC-99 (Device)", "192.168.1.105 (IP)", "Active Directory Domain Controller"],
        recentAnomalies: [
          AnomalyTimelineEvent(time: "02:40 AM", title: "Privilege Escalation", details: "Executed 8 admin override commands", score: 86),
        ],
      ),
      EntityProfile(
        username: "msmith",
        fullName: "Michael Smith",
        role: "Backend Architect",
        department: "Engineering",
        riskScore: 82,
        peerAvgRisk: 28,
        baselineHours: "10:00 AM - 07:00 PM",
        dailyBytesLimit: "500,000 KB (Current: 610,000 KB)",
        authorizedDevices: ["DEV-RIG-01"],
        linearChain: ["msmith (User)", "DEV-RIG-01 (Device)", "203.0.113.88 (VPN)", "Core GitHub Repo"],
        recentAnomalies: [
          AnomalyTimelineEvent(time: "07:10 AM", title: "Impossible Travel VPN Login", details: "Authenticated from Frankfurt IP after Tokyo session", score: 82),
        ],
      ),
      EntityProfile(
        username: "rpatel",
        fullName: "Rhea Patel",
        role: "HR Operations Specialist",
        department: "Human Resources",
        riskScore: 45,
        peerAvgRisk: 18,
        baselineHours: "09:00 AM - 05:00 PM",
        dailyBytesLimit: "100,000 KB (Current: 90,000 KB)",
        authorizedDevices: ["HR-WORKSTATION-08"],
        linearChain: ["rpatel (User)", "HR-WORKSTATION-08 (Device)", "10.0.2.14 (IP)", "Employee Records Share"],
        recentAnomalies: [
          AnomalyTimelineEvent(time: "08:15 PM", title: "Slight Off-hours Access", details: "Opened 3 employee performance files", score: 45),
        ],
      ),
    ]);

    // Initial Copilot Messages
    _copilotMessages.addAll([
      CopilotMessage(
        id: "COP-01",
        text: "Hello SOC Analyst! I am your TrustMatrix AI Copilot. I continuously monitor entity baselines, Isolation Forest anomaly scores, and autoencoder loss. How can I assist your investigation today?",
        isUser: false,
        timestamp: DateTime.now().subtract(const Duration(minutes: 30)),
      ),
    ]);

    // Initial SOAR Audit Log
    _soarAuditLog.addAll([
      SOARAuditEntry(
        id: "SOAR-101",
        action: "HOST_ISOLATION",
        target: "FIN-LAPTOP-04",
        analyst: "Analyst (Mobile App)",
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      SOARAuditEntry(
        id: "SOAR-102",
        action: "ACCOUNT_LOCKOUT",
        target: "user:svc_backup_temp",
        analyst: "Automated Rule #4",
        timestamp: DateTime.now().subtract(const Duration(hours: 4)),
      ),
    ]);
  }

  // ── Push Notification Simulation ─────────────────────────────────────────────

  void triggerSimulatedPushNotification() {
    final newId = "ALT-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}";
    final newAlert = AlertItem(
      id: newId,
      title: "🚨 CRITICAL: High-Volume Sensitive PDF Exfiltration",
      severity: AlertSeverity.critical,
      username: "jdoe",
      department: "Finance & Accounting",
      riskScore: 98,
      metricHighlight: "42 sensitive tax PDFs downloaded (300% above baseline)",
      description: "User jdoe accessed 42 restricted executive compensation & M&A PDF documents within 90 seconds from unapproved MAC address.",
      timestamp: DateTime.now(),
      linearChain: ["jdoe (User)", "UNAPPROVED-MAC-88 (Device)", "198.51.100.99 (IP)", "Executive M&A Share (Asset)"],
    );

    _alerts.insert(0, newAlert);
    _latestPushedAlert = newAlert;

    // Recalculate Org Risk Score
    _orgRiskScore = 88;

    notifyListeners();
  }

  // ── Alert Triage & SOAR Actions ──────────────────────────────────────────────

  void updateAlertStatus(String alertId, AlertStatus newStatus, {String analyst = "Analyst (Mobile)"}) {
    final idx = _alerts.indexWhere((a) => a.id == alertId);
    if (idx != -1) {
      _alerts[idx].status = newStatus;
      _soarAuditLog.insert(
        0,
        SOARAuditEntry(
          id: "SOAR-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}",
          action: "STATUS_UPDATE (${newStatus.name.toUpperCase()})",
          target: alertId,
          analyst: analyst,
          timestamp: DateTime.now(),
        ),
      );
      notifyListeners();
    }
  }

  void executeSOARAction(String alertId, String actionName, String target, {String analyst = "Analyst (Mobile App)"}) {
    final idx = _alerts.indexWhere((a) => a.id == alertId);
    if (idx != -1) {
      _alerts[idx].mitigationHistory.add("$actionName executed on $target at ${DateTime.now().hour}:${DateTime.now().minute}");
      _alerts[idx].status = AlertStatus.investigating;

      if (actionName.contains("ISOLATE")) {
        _activeIsolationsCount++;
      }

      _soarAuditLog.insert(
        0,
        SOARAuditEntry(
          id: "SOAR-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}",
          action: actionName,
          target: target,
          analyst: analyst,
          timestamp: DateTime.now(),
        ),
      );

      notifyListeners();
    }
  }

  // ── GenAI SOC Copilot Chat Simulation ────────────────────────────────────────

  void sendCopilotPrompt(String userText) {
    // Add user message
    _copilotMessages.add(
      CopilotMessage(
        id: "MSG-${DateTime.now().millisecondsSinceEpoch}",
        text: userText,
        isUser: true,
        timestamp: DateTime.now(),
      ),
    );
    notifyListeners();

    // Simulate AI response delay
    Timer(const Duration(milliseconds: 800), () {
      _generateAiResponse(userText);
    });
  }

  void _generateAiResponse(String userQuery) {
    String replyText = "";
    List<String> mitreTags = [];
    List<String> playbooks = [];

    final lower = userQuery.toLowerCase();

    if (lower.contains("492") || lower.contains("jdoe") || lower.contains("exfiltration")) {
      replyText = "### 🚨 Incident Summary: Alert #492 (User: jdoe)\n\n"
          "• **Anomaly Overview**: User `jdoe` initiated an unauthorized **85,000 KB** data transfer at **3:15 AM** to unrecognized external IP `198.51.100.44`.\n"
          "• **Baseline Deviation**: Byte volume is **320% above historical baseline** (typical working hours: 8 AM - 5:30 PM).\n"
          "• **Risk Score**: **94/100** (High Confidence Anomaly via Isolation Forest + Autoencoder MSE Loss).\n\n"
          "### 🛡️ Recommended Containment Playbook:\n"
          "1. Immediately isolate host `FIN-LAPTOP-04` from internal network fabric.\n"
          "2. Revoke active OAuth tokens & trigger forced MFA challenge.\n"
          "3. Block destination IP `198.51.100.44` on perimeter firewall.";
      mitreTags = ["T1078 (Valid Accounts)", "T1048.002 (Exfiltration Over Scheme)"];
      playbooks = ["Isolate Host: FIN-LAPTOP-04", "Lock Account: jdoe", "Block IP: 198.51.100.44"];
    } else if (lower.contains("mitre") || lower.contains("attack")) {
      replyText = "### 🎯 MITRE ATT&CK Threat Mapping\n\n"
          "Active threats across monitored entities map to the following tactics:\n"
          "1. **T1078 - Valid Accounts**: Used by `jdoe` and `admin_user` for off-hours access.\n"
          "2. **T1068 - Privilege Escalation**: Detected 8 administrative command overrides.\n"
          "3. **T1071.001 - Web Protocols**: Encrypted C2 tunnel simulation traffic.\n"
          "4. **T1053 - Scheduled Task/Job**: Shadow service account creation (`svc_backup_temp`).";
      mitreTags = ["T1078", "T1068", "T1071.001", "T1053"];
    } else if (lower.contains("summarize") || lower.contains("overview")) {
      replyText = "### 📊 Executive Incident Summary\n\n"
          "• **Current Threat Level**: ELEVATED (**78/100**)\n"
          "• **High/Critical Active Alerts**: 4 Incidents requiring immediate triage.\n"
          "• **Top Threat Actor**: User `jdoe` (Risk Score: 94) due to off-hours exfiltration.\n"
          "• **Active Containment**: 3 Hosts currently isolated in network quarantine.";
      mitreTags = ["T1048.002"];
      playbooks = ["Review Alert Feed", "Check SOAR Audit Log"];
    } else {
      replyText = "Based on current TrustMatrix telemetry:\n\n"
          "• **Target Entity**: `$userQuery` analyzed against historical baselines.\n"
          "• **Anomaly Assessment**: Isolation Forest anomaly score evaluates at normal range for standard business operations.\n"
          "• **Actionable Advice**: Continue monitoring user peer cohort for unexpected shifts in working hours or data volume limits.";
      mitreTags = ["T1078"];
    }

    _copilotMessages.add(
      CopilotMessage(
        id: "MSG-${DateTime.now().millisecondsSinceEpoch}",
        text: replyText,
        isUser: false,
        timestamp: DateTime.now(),
        mitreTags: mitreTags.isNotEmpty ? mitreTags : null,
        playbooks: playbooks.isNotEmpty ? playbooks : null,
      ),
    );
    notifyListeners();
  }

  // ── Entity Lookup ─────────────────────────────────────────────────────────────

  List<EntityProfile> searchEntities(String query) {
    if (query.trim().isEmpty) return _entities;
    final q = query.toLowerCase();
    return _entities.where((e) {
      return e.username.toLowerCase().contains(q) ||
          e.fullName.toLowerCase().contains(q) ||
          e.department.toLowerCase().contains(q) ||
          e.role.toLowerCase().contains(q);
    }).toList();
  }
}
