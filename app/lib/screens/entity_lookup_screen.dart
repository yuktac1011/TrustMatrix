import 'package:flutter/material.dart';
import '../services/simulation_service.dart';
import '../models/entity_profile.dart';
import '../widgets/glass_card.dart';
import '../widgets/linear_asset_chain.dart';

class EntityLookupScreen extends StatefulWidget {
  const EntityLookupScreen({super.key});

  @override
  State<EntityLookupScreen> createState() => _EntityLookupScreenState();
}

class _EntityLookupScreenState extends State<EntityLookupScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = "";

  @override
  Widget build(BuildContext context) {
    final sim = SimulationService();
    final results = sim.searchEntities(_query);

    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF09090B),
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.search, color: Color(0xFF06B6D4), size: 22),
            SizedBox(width: 8),
            Text(
              "ENTITY SEARCH & BASELINES",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.0),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Input Bar
            Padding(
              padding: const EdgeInsets.all(12),
              child: TextField(
                controller: _searchController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: "Search by username, name, or department...",
                  hintStyle: const TextStyle(color: Colors.white38, fontSize: 13),
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF06B6D4)),
                  suffixIcon: _query.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: Colors.white54),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _query = "");
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: const Color(0xFF12131A),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFF1E202E)),
                  ),
                ),
                onChanged: (val) => setState(() => _query = val),
              ),
            ),

            // Results List
            Expanded(
              child: results.isEmpty
                  ? const Center(
                      child: Text("No entities found matching query.", style: TextStyle(color: Colors.white54)),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.only(bottom: 24),
                      itemCount: results.length,
                      itemBuilder: (context, index) {
                        final entity = results[index];
                        return _buildEntityCard(context, entity);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEntityCard(BuildContext context, EntityProfile entity) {
    final isHighRisk = entity.riskScore >= 80;

    return GlassCard(
      borderColor: isHighRisk ? const Color(0xFFEF4444).withOpacity(0.4) : const Color(0xFF06B6D4).withOpacity(0.3),
      onTap: () => _showEntityDetailModal(context, entity),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 18,
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
                        style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "${entity.username} • ${entity.role}",
                        style: const TextStyle(color: Colors.white60, fontSize: 11),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: (isHighRisk ? const Color(0xFFEF4444) : const Color(0xFFF97316)).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: isHighRisk ? const Color(0xFFEF4444) : const Color(0xFFF97316)),
                ),
                child: Text(
                  "Risk: ${entity.riskScore}",
                  style: TextStyle(
                    color: isHighRisk ? const Color(0xFFEF4444) : const Color(0xFFF97316),
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),
          // Peer comparison progress indicator
          Row(
            children: [
              const Text("Peer Comparison:", style: TextStyle(color: Colors.white54, fontSize: 11)),
              const SizedBox(width: 8),
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: entity.riskScore / 100.0,
                    backgroundColor: const Color(0xFF1E202E),
                    color: isHighRisk ? const Color(0xFFEF4444) : const Color(0xFF06B6D4),
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

          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Dept: ${entity.department}",
                style: const TextStyle(color: Colors.white70, fontSize: 11),
              ),
              const Text(
                "View Baseline Profile >",
                style: TextStyle(color: Color(0xFF06B6D4), fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showEntityDetailModal(BuildContext context, EntityProfile entity) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF09090B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.85,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: const Color(0xFF7C3AED).withOpacity(0.2),
                          child: Text(
                            entity.username[0].toUpperCase(),
                            style: const TextStyle(color: Color(0xFFA78BFA), fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              entity.fullName,
                              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              "${entity.role} • ${entity.department}",
                              style: const TextStyle(color: Colors.white60, fontSize: 12),
                            ),
                          ],
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white70),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Risk Score vs Peer Cohort Box
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF12131A),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.4)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "PEER ANALYSIS COHORT COMPARISON",
                        style: TextStyle(color: Color(0xFFA78BFA), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Column(
                            children: [
                              Text(
                                "${entity.riskScore}",
                                style: TextStyle(
                                  color: entity.riskScore >= 80 ? const Color(0xFFEF4444) : const Color(0xFFF59E0B),
                                  fontSize: 26,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const Text("Entity Risk Score", style: TextStyle(color: Colors.white60, fontSize: 11)),
                            ],
                          ),
                          Container(height: 30, width: 1, color: Colors.white24),
                          Column(
                            children: [
                              Text(
                                "${entity.peerAvgRisk}",
                                style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 26, fontWeight: FontWeight.bold),
                              ),
                              const Text("Peer Dept Average", style: TextStyle(color: Colors.white60, fontSize: 11)),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Baseline Configuration Specs
                const Text("HISTORICAL BEHAVIORAL BASELINE", style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                const SizedBox(height: 8),
                _buildBaselineRow(Icons.access_time, "Typical Working Hours", entity.baselineHours),
                _buildBaselineRow(Icons.data_usage, "Daily Bytes Transfer Threshold", entity.dailyBytesLimit),
                _buildBaselineRow(Icons.devices, "Authorized Devices Whitelist", entity.authorizedDevices.join(", ")),

                const SizedBox(height: 16),
                // Linear Asset Relationship Chain
                LinearAssetChain(chainNodes: entity.linearChain),

                const SizedBox(height: 20),
                const Text("RECENT ANOMALY TIMELINE LOGS", style: TextStyle(color: Color(0xFFF59E0B), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                const SizedBox(height: 8),

                ...entity.recentAnomalies.map((anom) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E202E),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(anom.time, style: const TextStyle(color: Color(0xFFEF4444), fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(anom.title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                              Text(anom.details, style: const TextStyle(color: Colors.white60, fontSize: 11)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBaselineRow(IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 16, color: const Color(0xFF06B6D4)),
          const SizedBox(width: 8),
          Text("$title: ", style: const TextStyle(color: Colors.white60, fontSize: 12)),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
