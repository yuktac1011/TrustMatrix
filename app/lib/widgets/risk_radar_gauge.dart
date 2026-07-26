import 'dart:math' as math;
import 'package:flutter/material.dart';

class RiskRadarGauge extends StatelessWidget {
  final int score;
  final double size;

  const RiskRadarGauge({
    super.key,
    required this.score,
    this.size = 180,
  });

  Color get scoreColor {
    if (score >= 85) return const Color(0xFFEF4444); // Red Critical
    if (score >= 65) return const Color(0xFFF97316); // Orange High
    if (score >= 40) return const Color(0xFFF59E0B); // Amber Elevated
    return const Color(0xFF10B981); // Emerald Low
  }

  String get scoreLabel {
    if (score >= 85) return "CRITICAL THREAT";
    if (score >= 65) return "HIGH RISK";
    if (score >= 40) return "ELEVATED";
    return "NORMAL OPERATIONAL";
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: RadarGaugePainter(score: score, color: scoreColor),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "$score",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: size * 0.28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -1,
                  shadows: [
                    Shadow(
                      color: scoreColor.withOpacity(0.8),
                      blurRadius: 16,
                    ),
                  ],
                ),
              ),
              Text(
                "/100",
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: size * 0.08,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: scoreColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: scoreColor, width: 1),
                ),
                child: Text(
                  scoreLabel,
                  style: TextStyle(
                    color: scoreColor,
                    fontSize: size * 0.065,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class RadarGaugePainter extends CustomPainter {
  final int score;
  final Color color;

  RadarGaugePainter({required this.score, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - 12;

    // 1. Background Circle Grid Rings
    final bgPaint = Paint()
      ..color = const Color(0xFF1E202E)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    canvas.drawCircle(center, radius, bgPaint);
    canvas.drawCircle(center, radius * 0.7, Paint()
      ..color = const Color(0xFF1E202E).withOpacity(0.6)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5);
    canvas.drawCircle(center, radius * 0.4, Paint()
      ..color = const Color(0xFF1E202E).withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0);

    // 2. Crosshair grid lines
    final linePaint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..strokeWidth = 1.0;
    canvas.drawLine(Offset(center.dx - radius, center.dy), Offset(center.dx + radius, center.dy), linePaint);
    canvas.drawLine(Offset(center.dx, center.dy - radius), Offset(center.dx, center.dy + radius), linePaint);

    // 3. Active Score Arc
    final sweepAngle = (score / 100.0) * (2 * math.pi);
    final arcPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 8.0;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      sweepAngle,
      false,
      arcPaint,
    );

    // 4. Glow Overlay
    final glowPaint = Paint()
      ..color = color.withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 16.0
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      sweepAngle,
      false,
      glowPaint,
    );
  }

  @override
  bool shouldRepaint(covariant RadarGaugePainter oldDelegate) {
    return oldDelegate.score != score || oldDelegate.color != color;
  }
}
