<div align="center">

<br/>

```text
████████╗██████╗ ██╗   ██╗███████╗████████╗███╗   ███╗██████╗  █████╗ ████████╗██████╗ ██╗██╗  ██╗
╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
   ██║   ██████╔╝██║   ██║███████╗   ██║   ██╔████╔██║██████╔╝███████║   ██║   ██████╔╝██║ ╚███╔╝ 
   ██║   ██╔══██╗██║   ██║╚════██║   ██║   ██║╚██╔╝██║██╔══██╗██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
   ██║   ██║  ██║╚██████╔╝███████║   ██║   ██║ ╚═╝ ██║██║  ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
```

### *The Autonomous Intelligence Layer for Insider Threat Detection*

<br/>

[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge&color=dea127)](./LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-FFD43B?style=for-the-badge&logo=python&logoColor=black)](https://python.org)

<br/>

> **TrustMatrix** is an AI-powered Threat Hunting Platform designed for Security Operations Centers (SOCs) and Security Analysts.
> It treats insider threats not as static rule violations, but as dynamic behavioral anomalies.
> The platform continuously profiles, baselines, and scores entity behavior to intercept threats like data exfiltration and lateral movement before the damage is done.

<br/>

[**→ Live Demo**](#) · [**→ Documentation**](./docs) · [**→ API Reference**](./docs/04_API) · [**→ Report an Issue**](#)

<br/>

---

</div>

<br/>

## 📌 Table of Contents

- [What is TrustMatrix?](#-what-is-trustmatrix)
- [Key Features (As per Problem Statement)](#-key-features-as-per-problem-statement)
- [Extra Features Added](#-extra-features-added)
- [Screenshots](#-screenshots)
- [Architecture Overview](#️-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Manual Setup](#manual-setup)
- [Threat Intelligence Modules](#-threat-intelligence-modules)
- [API Overview](#-api-overview)
- [Database Schema](#️-database-schema)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

<br/>

---

## 🧠 What is TrustMatrix?

Most SOC teams spend more time **chasing false positives and managing static rules** than actually hunting threats — yet insider threats rarely trigger simple thresholds.

TrustMatrix changes this by asking a fundamentally different question:

> ~~"Which rule did this user break?"~~
> **"How anomalous is this behavior compared to their baseline?"**

Because insider threats are among the hardest to detect, the activity often resembles normal behavior right up until damage is done — an employee quietly accessing sensitive files before resignation, or data being moved out in small, disguised increments.

Unlike static SIEMs or rule-based triggers, TrustMatrix:

- 📦 **Ingests** simulated organizational logs (login activity, file access, data transfers) continuously.
- 🔍 **Profiles & Baselines** every entity (user/device) to establish "normal" behavior patterns.
- 📊 **Scores** risk dynamically by correlating multiple anomalous signals, significantly reducing false positives.
- 🕸️ **Maps** lateral movement through advanced Graph Intelligence and Peer Analysis.
- 💡 **Recommends** remediation steps via an integrated SOC Co-pilot (Generative AI).
- 🕰️ **Simulates** realistic insider threats for continuous model validation and testing.

<br/>

---

## 🎯 Key Features (As per Problem Statement)

<br/>

| Module | What It Does |
|---|---|
| 🗂️ **Log Ingestion** | Ingests simulated organizational logs for file access, logins, and transfers. |
| 🔬 **Behavioral Baseline Modeling** | Establishes normal behavior patterns per user/entity to serve as a baseline. |
| 📏 **Anomaly Detection Engine** | Uses machine learning and statistical models instead of purely rule-based triggers. |
| 🛡️ **Risk Engine & Scoring** | Assigns composite risk scores for prioritized alert dashboards. |
| 📉 **Low False-Positive Design** | Reduces alert fatigue by correlating multiple signals before flagging an event. |

<br/>

---

## ✨ Extra Features Added

<br/>

| Module | What It Does |
|---|---|
| 🤖 **SOC Co-pilot** | LLM-powered assistant (GenAI) to help analysts investigate alerts contextually. |
| 🕸️ **Graph Intelligence** | Maps entity relationships (users, devices, IPs) using network graphs (`networkx`) to detect lateral movement. |
| 👥 **Peer Analysis** | Compares an individual's behavior against their peers or department to identify outliers more accurately. |
| 👻 **Shadow Accounts** | Identifies unmanaged, orphaned, or unauthorized accounts that could be exploited by insiders. |
| ⚡ **Real-time WebSockets** | Pushes critical alerts to the dashboard instantly via WebSockets for immediate response. |
| 🎯 **Threat Simulator** | Built-in engine to safely simulate realistic insider threat scenarios for continuous testing and validation. |

<br/>

---

## 📸 Screenshots

<br/>

> **SOC Dashboard** — Live intelligence summaries across the organization

```text
┌──────┬───────────────────────────────────────────────────┐
│      │ ● Risk Score  ● Anomalies  ● Entities  ● Alerts  │
│  📊  ├───────────────────────────────────────────────────┤
│      │                                                   │
│ NAV  │  [HIGH RISK]  [14 Active]  [1,204 Monitored]      │
│      │                                                   │
│  🗂  │  ┌──────────────┐  ┌──────────────────────────┐  │
│      │  │ Risk Radar   │  │  Top Critical Alerts       │  │
│  📈  │  │   ██████     │  │  🔴 Exfiltration Detected  │  │
│      │  │  ████████    │  │  ⚠️ Unusual Login (VPN)    │  │
│  💡  │  │   ██████     │  │  ✅ Account Locked Out     │  │
│      │  └──────────────┘  └──────────────────────────┘  │
└──────┴───────────────────────────────────────────────────┘
```

> **SOC Co-pilot (GenAI)** — Contextual investigation assistance

```text
┌────────────────────────────────────────────────────────────────┐
│  Agent: How can I assist with Alert #492 (Data Exfiltration)?  │
│                                                                │
│  User: Summarize the user's activity prior to the alert.       │
│                                                                │
│  Agent: In the past 48 hours, user JDOE accessed 42 sensitive  │
│         documents (300% above baseline). This occurred off-    │
│         hours, followed by an encrypted zip creation.          │
│                                                                │
│  [ Generate Incident Report ]    [ Isolate Host ]              │
└────────────────────────────────────────────────────────────────┘
```

<br/>

---

## 🏛️ Architecture Overview

```text
                         ┌─────────────────────────────────────┐
                         │         TrustMatrix Platform        │
                         └─────────────────────────────────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
    ┌─────────▼──────────┐   ┌────────────▼────────────┐   ┌──────────▼──────────┐
    │   Frontend UI      │   │   FastAPI Backend       │   │   Data Storage      │
    │   (Planned)        │   │   (Python 3.10+)        │   │   (Entity/Logs)     │
    │                    │   │                         │   │                     │
    │  ┌──────────────┐  │   │  ┌────────────────────┐ │   │   Entity Profiles   │
    │  │ SOC Dashboard│  │   │  │ REST / WebSocket   │ │   │   Alerts            │
    │  │ Alert Center │◄─┼───┼─►│ /api/v1/...        │ │   │   Anomalies         │
    │  │ Entity Graph │  │   │  └────────────────────┘ │   │   Logs              │
    │  │ GenAI Copilot│  │   │           │             │   └─────────────────────┘
    │  └──────────────┘  │   │  ┌────────▼───────────┐ │
    │                    │   │  │ Threat Engines     │ │   ┌─────────────────────┐
    │  ┌──────────────┐  │   │  │                    │ │   │   Redis 7           │
    │  │ Zustand      │  │   │  │  • Baseline Engine │◄┼──►│   (Task Queue)      │
    │  │ TanStack     │  │   │  │  • Anomaly Detect  │ │   │   Celery Workers    │
    │  │ Query        │  │   │  │  • Graph Intel     │ │   └─────────────────────┘
    │  └──────────────┘  │   │  │  • Peer Analysis   │ │
    └────────────────────┘   │  │  • Risk Engine     │ │
                             │  └────────────────────┘ │
                             │           │             │
                             │  ┌────────▼───────────┐ │
                             │  │ scikit-learn / xgb │ │
                             │  │ networkx / GenAI   │ │
                             │  └────────────────────┘ │
                             └─────────────────────────┘
```

<br/>

---

## 🛠 Tech Stack

### Backend (Implemented)

| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | ≥ 0.110 | ASGI REST API framework |
| **Uvicorn** | ≥ 0.28 | ASGI web server |
| **Pydantic v2** | ≥ 2.6 | Data validation & schemas |
| **SQLAlchemy** | ≥ 2.0 | ORM & database abstraction |
| **Celery** | ≥ 5.3 | Async background task queue |
| **pandas / NumPy** | latest | Data processing & aggregation |
| **scikit-learn / XGBoost** | latest | Machine learning for anomaly detection |
| **NetworkX** | ≥ 3.2 | Graph intelligence for lateral movement |
| **OpenAI / GenAI** | latest | SOC Copilot intelligence layer |

### Infrastructure

| Technology | Purpose |
|---|---|
| **Redis 7** | Caching, Rate limiting, Celery broker |

<br/>

---

## 📁 Project Structure

```text
AUTONOMOUS-THREAT-HUNTER-FOR-INSIDER-ATTACKS/
├── 📂 backend/                    # FastAPI Python Application
│   ├── 📄 requirements.txt        # Python dependencies
│   ├── 📄 .env                    # Environment variables
│   └── 📂 app/                    # Application source
│       ├── 📄 main.py             # FastAPI entry point
│       ├── 📂 core/               # Config, security, middleware
│       ├── 📂 features/           # Threat Intelligence Engines
│       │   ├── 📂 anomaly_detector/ # ML isolation forests, autoencoders
│       │   ├── 📂 baseline_engine/  # Entity profiling
│       │   ├── 📂 graph_intelligence/ # NetworkX relationship mapping
│       │   ├── 📂 log_ingestor/     # High-speed data ingestion pipeline
│       │   ├── 📂 peer_analysis/    # Cohort-based anomaly detection
│       │   ├── 📂 risk_engine/      # Composite risk scoring
│       │   ├── 📂 shadow_accounts/  # Unmanaged account detection
│       │   ├── 📂 soc_copilot/      # GenAI chat interfaces
│       │   ├── 📂 threat_simulator/ # Attack vector generation
│       │   └── 📂 websocket_alerts/ # Real-time frontend sync
├── 📄 .gitignore                  # Git ignore rules
└── 📄 README.md                   # Project documentation
```

<br/>

---

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are installed on your machine:

| Tool | Minimum Version | Install |
|---|---|---|
| **Python** | 3.10+ | [python.org](https://python.org) |

---

### Manual Setup

#### Backend

```bash
# 1. Clone the repository
git clone https://github.com/your-org/AUTONOMOUS-THREAT-HUNTER-FOR-INSIDER-ATTACKS.git
cd AUTONOMOUS-THREAT-HUNTER-FOR-INSIDER-ATTACKS/backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Set environment variables
cp .env.example .env
# Edit .env with your OpenAI API keys, Redis, and DB URIs

# 5. Start the FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

The API documentation will be available at `http://localhost:8000/docs`.

<br/>

---

## 🔬 Threat Intelligence Modules

### 1. Baseline Engine & Anomaly Detector
- Ingests raw logs continuously and builds a behavioral profile per user.
- Utilizes statistical models (Isolation Forests, XGBoost) instead of static thresholds to spot true anomalies.

### 2. Graph Intelligence & Peer Analysis
- Constructs a directed graph of User -> Device -> Asset using `networkx`.
- Detects lateral movement and compares user activity metrics against their departmental peers.

### 3. Risk Engine & Scoring
- Consolidates disparate anomaly signals (login anomaly + file access anomaly).
- Applies a composite Risk Score to minimize alert fatigue and false positives.

### 4. SOC Co-pilot
- Leverages Google Generative AI / OpenAI to read alerts and provide conversational triage.
- Analysts can ask questions like "Is this IP associated with known threat actors?" directly in the dashboard.

<br/>

---

## 📡 API Overview

The REST API is organized by threat intelligence features:

```text
Ingestion & Simulation
  POST   /api/v1/logs/ingest          Stream log data
  POST   /api/v1/threats/simulate     Run attack scenario

Intelligence
  GET    /api/v1/entities/:id/profile Fetch behavior baseline
  GET    /api/v1/graph/relationships  Get network graph data
  GET    /api/v1/risk/alerts          Fetch prioritized alerts

SOC Copilot
  POST   /api/v1/copilot/chat         Query the GenAI assistant
```

<br/>

---

## 🗃️ Database Schema (Conceptual)

```sql
-- Tracked Entities
entities (
  entity_id      UUID PRIMARY KEY,
  type           VARCHAR(50), -- 'user', 'device', 'ip'
  department     VARCHAR(100),
  risk_score     FLOAT DEFAULT 0.0
)

-- Raw Log Storage
logs (
  log_id         UUID PRIMARY KEY,
  entity_id      UUID REFERENCES entities(entity_id),
  action         VARCHAR(100),
  timestamp      TIMESTAMPTZ,
  metadata       JSONB
)

-- Detected Anomalies
anomalies (
  anomaly_id     UUID PRIMARY KEY,
  entity_id      UUID REFERENCES entities(entity_id),
  score          FLOAT,
  description    TEXT,
  detected_at    TIMESTAMPTZ
)

-- Consolidated Alerts
alerts (
  alert_id       UUID PRIMARY KEY,
  entity_id      UUID REFERENCES entities(entity_id),
  severity       VARCHAR(20), -- 'critical', 'high', 'low'
  status         VARCHAR(20), -- 'open', 'investigating', 'closed'
  created_at     TIMESTAMPTZ
)
```

<br/>

---

## 🗺️ Roadmap

### ✅ MVP (Backend Layer) — Complete
- [x] Log Ingestor & Simulation pipelines
- [x] Behavioral Baseline Engine
- [x] ML-based Anomaly Detection
- [x] Graph Intelligence mappings
- [x] Peer Analysis integration
- [x] SOC Co-pilot endpoints
- [x] WebSocket infrastructure for real-time alerts

### 🔄 Phase 2 — Frontend Integration (In Progress)
- [ ] Next.js 14 Dashboard scaffolding
- [ ] Real-time D3.js / Vis.js graph rendering
- [ ] Auth & RBAC (Role-Based Access Control)
- [ ] SOC Copilot Chat UI

### 🔭 Phase 3 — Advanced Capabilities (Planned)
- [ ] Automated isolation/remediation playbooks
- [ ] Deep Learning auto-encoders for complex feature extraction
- [ ] Multi-tenant support

<br/>

---

## 🤝 Contributing

Contributions are warmly welcome!

```bash
# 1. Fork the repository
# 2. Clone your fork
# 3. Create a feature branch: git checkout -b feature/awesome-addition
# 4. Commit your changes: git commit -m "feat: adding new ML model"
# 5. Push and open a Pull Request
```

<br/>

---

## 📄 License

```text
MIT License

Copyright (c) 2026 TrustMatrix Engineering Team

Permission is hereby granted, free of charge, to any person obtaining a copy...
(See LICENSE file for full text).
```

<br/>

---

<div align="center">

**Built for Modern Security Teams**

*Hunting threats autonomously, so you don't have to.*

<br/>



*"Is this behavior normal?"*

</div>

---
