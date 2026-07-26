import 'package:flutter/material.dart';
import '../services/simulation_service.dart';
import '../widgets/notification_banner.dart';
import 'dashboard_screen.dart';
import 'alerts_screen.dart';
import 'copilot_screen.dart';
import 'entity_lookup_screen.dart';
import 'soar_audit_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  void _onTabSelected(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final sim = SimulationService();

    final screens = [
      DashboardScreen(onNavigateTab: _onTabSelected),
      const AlertsScreen(),
      const CopilotScreen(),
      const EntityLookupScreen(),
      const SOARAuditScreen(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      body: Stack(
        children: [
          // Current Selected Screen
          IndexedStack(
            index: _currentIndex,
            children: screens,
          ),

          // Real-Time Push Notification Banner Overlay
          ListenableBuilder(
            listenable: sim,
            builder: (context, _) {
              final latestAlert = sim.latestPushedAlert;
              if (latestAlert == null) return const SizedBox.shrink();

              return Positioned(
                top: 40,
                left: 12,
                right: 12,
                child: NotificationBanner(
                  alert: latestAlert,
                  onTap: () {
                    sim.clearLatestPushedAlert();
                    setState(() => _currentIndex = 1); // Navigate to Alerts feed
                  },
                  onClose: () {
                    sim.clearLatestPushedAlert();
                  },
                ),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF12131A),
          border: Border(top: BorderSide(color: Color(0xFF1E202E), width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onTabSelected,
          backgroundColor: const Color(0xFF12131A),
          selectedItemColor: const Color(0xFFA78BFA),
          unselectedItemColor: Colors.white38,
          type: BottomNavigationBarType.fixed,
          selectedFontSize: 11,
          unselectedFontSize: 10,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: "Radar",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.notifications_outlined),
              activeIcon: Icon(Icons.notifications_active),
              label: "Alerts",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.smart_toy_outlined),
              activeIcon: Icon(Icons.smart_toy),
              label: "Co-Pilot",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_search_outlined),
              activeIcon: Icon(Icons.person_search),
              label: "Entities",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history),
              activeIcon: Icon(Icons.history_toggle_off),
              label: "SOAR",
            ),
          ],
        ),
      ),
    );
  }
}
