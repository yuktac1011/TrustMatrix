import 'package:flutter/material.dart';

class LinearAssetChain extends StatelessWidget {
  final List<String> chainNodes;

  const LinearAssetChain({
    super.key,
    required this.chainNodes,
  });

  IconData _getIconForNode(int index, String nodeText) {
    final lower = nodeText.toLowerCase();
    if (lower.contains("user") || index == 0) return Icons.person_pin;
    if (lower.contains("device") || lower.contains("laptop") || lower.contains("rig")) return Icons.laptop_mac;
    if (lower.contains("ip") || lower.contains("vpn") || lower.contains("gateway")) return Icons.router;
    return Icons.storage; // Asset / Database
  }

  @override
  Widget build(BuildContext context) {
    if (chainNodes.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "ENTITY RELATIONSHIP CHAIN",
          style: TextStyle(
            color: Color(0xFF06B6D4),
            fontSize: 11,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.0,
          ),
        ),
        const SizedBox(height: 10),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: List.generate(chainNodes.length, (idx) {
              final node = chainNodes[idx];
              final isLast = idx == chainNodes.length - 1;
              final icon = _getIconForNode(idx, node);

              return Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E202E),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: idx == 0
                            ? const Color(0xFF7C3AED)
                            : (isLast ? const Color(0xFFEF4444) : const Color(0xFF06B6D4)),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          icon,
                          size: 16,
                          color: idx == 0
                              ? const Color(0xFFA78BFA)
                              : (isLast ? const Color(0xFFFCA5A5) : const Color(0xFF67E8F9)),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          node,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (!isLast)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Icon(
                        Icons.arrow_forward,
                        size: 14,
                        color: Colors.white.withOpacity(0.4),
                      ),
                    ),
                ],
              );
            }),
          ),
        ),
      ],
    );
  }
}
