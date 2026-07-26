import 'package:flutter/material.dart';
import '../services/simulation_service.dart';
import '../models/alert_item.dart';
import '../widgets/glass_card.dart';
import '../widgets/linear_asset_chain.dart';

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  String _selectedFilter = "ALL";

  @override
  Widget build(BuildContext context) {
    final sim = SimulationService();

    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF09090B),
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.notifications_active, color: Color(0xFFEF4444), size: 22),
            SizedBox(width: 8),
            Text(
              "INCIDENT ALERTS FEED",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.0),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: ListenableBuilder(
          listenable: sim,
          builder: (context, _) {
            final allAlerts = sim.alerts;
            final filteredAlerts = allAlerts.where((a) {
              if (_selectedFilter == "CRITICAL") return a.severity == AlertSeverity.critical;
              if (_selectedFilter == "HIGH") return a.severity == AlertSeverity.high;
              if (_selectedFilter == "OPEN") return a.status == AlertStatus.open;
              if (_selectedFilter == "RESOLVED") return a.status == AlertStatus.resolved;
              return true;
            }).toList();

            return Column(
              children: [
                // Filter Chip Bar
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: Row(
                    children: ["ALL", "CRITICAL", "HIGH", "OPEN", "RESOLVED"].map((filter) {
                      final isSelected = _selectedFilter == filter;
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ChoiceChip(
                          label: Text(filter),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) setState(() => _selectedFilter = filter);
                          },
                          selectedColor: const Color(0xFF7C3AED),
                          backgroundColor: const Color(0xFF1E202E),
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : Colors.white60,
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),

                // Alerts List
                Expanded(
                  child: filteredAlerts.isEmpty
                      ? const Center(
                          child: Text("No alerts match the selected filter.", style: TextStyle(color: Colors.white54)),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.only(bottom: 24),
                          itemCount: filteredAlerts.length,
                          itemBuilder: (context, index) {
                            final alert = filteredAlerts[index];
                            return _buildAlertCard(context, alert);
                          },
                        ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildAlertCard(BuildContext context, AlertItem alert) {
    return GlassCard(
      borderColor: alert.severityColor.withOpacity(0.4),
      onTap: () => _showTriageBottomSheet(context, alert),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: alert.severityColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: alert.severityColor, width: 1),
                    ),
                    child: Text(
                      alert.severityLabel,
                      style: TextStyle(color: alert.severityColor, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    alert.id,
                    style: const TextStyle(color: Colors.white60, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E202E),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  alert.statusLabel,
                  style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            alert.title,
            style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.person_outline, size: 14, color: Color(0xFFA78BFA)),
              const SizedBox(width: 4),
              Text("${alert.username} (${alert.department})", style: const TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF09090B),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white10),
            ),
            child: Row(
              children: [
                const Icon(Icons.analytics_outlined, size: 14, color: Color(0xFF06B6D4)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    alert.metricHighlight,
                    style: const TextStyle(color: Color(0xFF67E8F9), fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Risk Score: ${alert.riskScore}/100",
                style: TextStyle(color: alert.severityColor, fontWeight: FontWeight.bold, fontSize: 12),
              ),
              const Text(
                "Tap to Triage & Mitigate >",
                style: TextStyle(color: Color(0xFFA78BFA), fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showTriageBottomSheet(BuildContext context, AlertItem alert) {
    final sim = SimulationService();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF09090B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: const EdgeInsets.all(20),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Modal Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: alert.severityColor.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: alert.severityColor),
                              ),
                              child: Text(
                                alert.severityLabel,
                                style: TextStyle(color: alert.severityColor, fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              alert.id,
                              style: const TextStyle(color: Colors.white70, fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white70),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),
                    Text(
                      alert.title,
                      style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      alert.description,
                      style: const TextStyle(color: Colors.white70, fontSize: 13),
                    ),

                    const SizedBox(height: 16),
                    // Linear Asset Chain Visualizer
                    LinearAssetChain(chainNodes: alert.linearChain),

                    const SizedBox(height: 20),
                    const Text(
                      "⚡ ONE-TAP SOAR CONTAINMENT ACTIONS",
                      style: TextStyle(color: Color(0xFFEF4444), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0),
                    ),
                    const SizedBox(height: 10),

                    // Quick Action Buttons Grid
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _buildActionButton(
                          label: "Isolate Host",
                          icon: Icons.wifi_off,
                          color: const Color(0xFFEF4444),
                          onPressed: () {
                            sim.executeSOARAction(alert.id, "HOST_ISOLATION", alert.linearChain.length > 1 ? alert.linearChain[1] : alert.username);
                            setModalState(() {});
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text("🛡️ Host Isolated & Network Quarantined")),
                            );
                          },
                        ),
                        _buildActionButton(
                          label: "Lock Account",
                          icon: Icons.no_accounts,
                          color: const Color(0xFFF97316),
                          onPressed: () {
                            sim.executeSOARAction(alert.id, "ACCOUNT_LOCKOUT", "user:${alert.username}");
                            setModalState(() {});
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text("🔒 User Account Locked & Tokens Revoked")),
                            );
                          },
                        ),
                        _buildActionButton(
                          label: "Force MFA",
                          icon: Icons.phonelink_lock,
                          color: const Color(0xFF7C3AED),
                          onPressed: () {
                            sim.executeSOARAction(alert.id, "FORCE_MFA_CHALLENGE", alert.username);
                            setModalState(() {});
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text("🔐 Step-up MFA Challenge Triggered")),
                            );
                          },
                        ),
                        _buildActionButton(
                          label: "Assign to Me",
                          icon: Icons.assignment_ind,
                          color: const Color(0xFF06B6D4),
                          onPressed: () {
                            sim.updateAlertStatus(alert.id, AlertStatus.investigating);
                            setModalState(() {});
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text("👤 Incident Assigned & Status set to INVESTIGATING")),
                            );
                          },
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),
                    const Text(
                      "STATUS WORKFLOW TOGGLE",
                      style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0),
                    ),
                    const SizedBox(height: 8),

                    Row(
                      children: [
                        _buildStatusChip(context, alert, AlertStatus.open, "OPEN", setModalState),
                        const SizedBox(width: 6),
                        _buildStatusChip(context, alert, AlertStatus.investigating, "INVESTIGATING", setModalState),
                        const SizedBox(width: 6),
                        _buildStatusChip(context, alert, AlertStatus.resolved, "RESOLVED", setModalState),
                      ],
                    ),

                    if (alert.mitigationHistory.isNotEmpty) ...[
                      const SizedBox(height: 20),
                      const Text(
                        "MITIGATION HISTORY",
                        style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0),
                      ),
                      const SizedBox(height: 8),
                      ...alert.mitigationHistory.map(
                        (history) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_outline, size: 14, color: Color(0xFF10B981)),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(history, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildActionButton({
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 16),
      label: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      style: ElevatedButton.styleFrom(
        backgroundColor: color.withOpacity(0.2),
        foregroundColor: color,
        side: BorderSide(color: color),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
    );
  }

  Widget _buildStatusChip(BuildContext context, AlertItem alert, AlertStatus status, String label, StateSetter setModalState) {
    final isCurrent = alert.status == status;
    return ChoiceChip(
      label: Text(label),
      selected: isCurrent,
      onSelected: (selected) {
        if (selected) {
          SimulationService().updateAlertStatus(alert.id, status);
          setModalState(() {});
        }
      },
      selectedColor: const Color(0xFF7C3AED),
      backgroundColor: const Color(0xFF1E202E),
      labelStyle: TextStyle(
        color: isCurrent ? Colors.white : Colors.white60,
        fontSize: 10,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}
