import 'package:flutter/material.dart';
import '../services/simulation_service.dart';
import '../services/biometric_service.dart';
import '../widgets/glass_card.dart';
import '../widgets/risk_radar_gauge.dart';

class DashboardScreen extends StatelessWidget {
  final Function(int) onNavigateTab;

  const DashboardScreen({
    super.key,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context) {
    final sim = SimulationService();
    final topAnomalies = sim.topAnomalousEntities;

    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      body: SafeArea(
        child: ListenableBuilder(
          listenable: sim,
          builder: (context, _) {
            return SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Header Bar
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF7C3AED).withOpacity(0.2),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: const Color(0xFF7C3AED)),
                              ),
                              child: const Icon(Icons.shield, color: Color(0xFFA78BFA), size: 22),
                            ),
                            const SizedBox(width: 10),
                            const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "TRUSTMATRIX SOC",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.2,
                                  ),
                                ),
                                Text(
                                  "Executive Threat Radar",
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            // Push Alert Simulation Trigger
                            IconButton(
                              icon: const Icon(Icons.add_alert, color: Color(0xFFF59E0B)),
                              tooltip: "Simulate Push Alert",
                              onPressed: () {
                                sim.triggerSimulatedPushNotification();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text("🚨 Real-Time Critical Alert Ingested!"),
                                    backgroundColor: Color(0xFFEF4444),
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              },
                            ),
                            // Lock App Button
                            IconButton(
                              icon: const Icon(Icons.lock_outline, color: Colors.white70),
                              tooltip: "Lock App Session",
                              onPressed: () {
                                BiometricService().lockApp();
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Executive Risk Gauge Card
                  GlassCard(
                    padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                    child: Column(
                      children: [
                        const Text(
                          "ORGANIZATIONAL RISK LEVEL",
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 16),
                        RiskRadarGauge(score: sim.orgRiskScore, size: 190),
                        const SizedBox(height: 16),
                        const Text(
                          "Autonomous ML Ensemble evaluating Isolation Forest & Autoencoder loss in real time.",
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white54, fontSize: 11),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Quick SOC Metrics Grid
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            title: "CRITICAL ALERTS",
                            value: "${sim.criticalAlerts.length}",
                            color: const Color(0xFFEF4444),
                            icon: Icons.error_outline,
                            onTap: () => onNavigateTab(1), // Alerts Tab
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildMetricCard(
                            title: "MONITORED ENTITIES",
                            value: "${sim.monitoredEntitiesCount}",
                            color: const Color(0xFF06B6D4),
                            icon: Icons.group,
                            onTap: () => onNavigateTab(3), // Entities Tab
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildMetricCard(
                            title: "ACTIVE ISOLATIONS",
                            value: "${sim.activeIsolationsCount}",
                            color: const Color(0xFF7C3AED),
                            icon: Icons.wifi_off,
                            onTap: () => onNavigateTab(4), // SOAR Tab
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Top 5 Anomalous Entities Section
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "TOP 5 ANOMALOUS ENTITIES",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                        TextButton(
                          onPressed: () => onNavigateTab(3),
                          child: const Text(
                            "View All >",
                            style: TextStyle(color: Color(0xFFA78BFA), fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ),

                  ...topAnomalies.map((entity) {
                    return GlassCard(
                      onTap: () => onNavigateTab(3),
                      padding: const EdgeInsets.all(14),
                      borderColor: entity.riskScore >= 80
                          ? const Color(0xFFEF4444).withOpacity(0.4)
                          : const Color(0xFFF59E0B).withOpacity(0.3),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  CircleAvatar(
                                    radius: 16,
                                    backgroundColor: const Color(0xFF7C3AED).withOpacity(0.2),
                                    child: Text(
                                      entity.username[0].toUpperCase(),
                                      style: const TextStyle(color: Color(0xFFA78BFA), fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        entity.fullName,
                                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                      ),
                                      Text(
                                        "${entity.username} • ${entity.department}",
                                        style: const TextStyle(color: Colors.white54, fontSize: 11),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: (entity.riskScore >= 80 ? const Color(0xFFEF4444) : const Color(0xFFF97316)).withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: entity.riskScore >= 80 ? const Color(0xFFEF4444) : const Color(0xFFF97316),
                                  ),
                                ),
                                child: Text(
                                  "Risk: ${entity.riskScore}/100",
                                  style: TextStyle(
                                    color: entity.riskScore >= 80 ? const Color(0xFFEF4444) : const Color(0xFFF97316),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          // Peer Comparison Bar
                          Row(
                            children: [
                              const Text("Vs Department Peer Avg:", style: TextStyle(color: Colors.white54, fontSize: 11)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: LinearProgressIndicator(
                                    value: entity.riskScore / 100.0,
                                    backgroundColor: const Color(0xFF1E202E),
                                    color: entity.riskScore >= 80 ? const Color(0xFFEF4444) : const Color(0xFFF59E0B),
                                    minHeight: 6,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "${entity.peerAvgRisk} (Peer Avg)",
                                style: const TextStyle(color: Colors.white38, fontSize: 10),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required Color color,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GlassCard(
      margin: EdgeInsets.zero,
      padding: const EdgeInsets.all(12),
      borderColor: color.withOpacity(0.4),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
              shadows: [Shadow(color: color.withOpacity(0.6), blurRadius: 8)],
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 9, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
