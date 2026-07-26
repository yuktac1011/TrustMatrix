import 'package:flutter/material.dart';
import '../services/simulation_service.dart';
import '../widgets/glass_card.dart';

class SOARAuditScreen extends StatelessWidget {
  const SOARAuditScreen({super.key});

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
            Icon(Icons.history, color: Color(0xFF10B981), size: 22),
            SizedBox(width: 8),
            Text(
              "SOAR REMEDIATION AUDIT LOG",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.0),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: ListenableBuilder(
          listenable: sim,
          builder: (context, _) {
            final auditLogs = sim.soarAuditLog;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text(
                    "REAL-TIME REMEDIATION CONTAINMENT AUDIT TRAIL",
                    style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0),
                  ),
                ),
                Expanded(
                  child: auditLogs.isEmpty
                      ? const Center(
                          child: Text("No SOAR containment actions logged.", style: TextStyle(color: Colors.white54)),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.only(bottom: 24),
                          itemCount: auditLogs.length,
                          itemBuilder: (context, index) {
                            final entry = auditLogs[index];
                            return _buildAuditCard(entry);
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

  Widget _buildAuditCard(SOARAuditEntry entry) {
    return GlassCard(
      borderColor: const Color(0xFF10B981).withOpacity(0.3),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      entry.action,
                      style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      "${entry.timestamp.hour}:${entry.timestamp.minute.toString().padLeft(2, '0')}",
                      style: const TextStyle(color: Colors.white38, fontSize: 11),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  "Target: ${entry.target}",
                  style: const TextStyle(color: Color(0xFF67E8F9), fontSize: 12, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 2),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "By: ${entry.analyst}",
                      style: const TextStyle(color: Colors.white54, fontSize: 11),
                    ),
                    Text(
                      entry.status,
                      style: const TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
