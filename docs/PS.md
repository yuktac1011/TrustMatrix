# CYBERSECURITY

## Problem Statement 1: Autonomous Threat Hunter for Insider Attacks

### Background

Insider threats are among the hardest to detect because the activity often resembles normal behavior right up until damage is done — an employee quietly accessing sensitive files before resignation, or data being moved out in small, disguised increments.

### Objective

Build a system that ingests simulated organizational logs (login activity, file access, data transfers) and uses behavioral baselining to identify insider threats.

The system should minimize false positives by relying on anomaly detection rather than static, rule-based triggers alone.

### Suggested Focus Areas

- Behavioral baseline modeling per user/entity
- Anomaly detection engine (not purely rule-based)
- Alert dashboard with severity scoring
- Low false-positive design philosophy