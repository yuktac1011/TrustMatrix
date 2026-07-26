<div align="center">

<br/>

```text
████████╗██████╗ ██╗   ██╗███████╗████████╗███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
   ██║   ██████╔╝██║   ██║███████╗   ██║   ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
   ██║   ██╔══██╗██║   ██║╚════██║   ██║   ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
   ██║   ██║  ██║╚██████╔╝███████║   ██║   ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
```

### *The Autonomous Intelligence Layer for Insider Threat Detection & UEBA AI SOC Platform*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.11-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Mobile App](https://img.shields.io/badge/Mobile_App-iOS_%7C_Android-007AFF?style=for-the-badge&logo=apple&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Python-3.10+-FFD43B?style=for-the-badge&logo=python&logoColor=black)](https://python.org)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge&color=dea127)](./LICENSE)

<br/>

> **TrustMatrix** is a **Dual-Platform (Web Platform & Mobile App)** Next-Gen User & Entity Behavior Analytics (UEBA) and Autonomous Threat Hunting Platform built for modern Security Operations Centers (SOCs) and security teams on the go.
> Instead of relying on static SIEM rules that flood analysts with false positives, TrustMatrix continuously profiles entity behavior using machine learning ensemble models (Isolation Forests, Autoencoders), Graph Intelligence, NLP topic extraction, and Generative AI SOC Copilot for instant threat explainability and SOAR remediation.

<br/>

---

</div>

<br/>

## 📌 Table of Contents

- [🧠 Core Value Proposition](#-core-value-proposition)
- [🎯 Key Features & Modules](#-key-features--modules)
- [✨ Extra Features (Web & Mobile App)](#-extra-features-web--mobile-app)
- [🎨 Next-Gen UI/UX Design System](#-next-gen-uiux-design-system)
- [🏛️ System Architecture](#️-system-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📁 Repository Structure](#-repository-structure)
- [⚡ Local Quickstart Guide for Judges](#-local-quickstart-guide-for-judges)
- [🎬 Judge Demonstration Walkthrough](#-judge-demonstration-walkthrough)
- [📡 API Reference](#-api-reference)
- [📄 License](#-license)

<br/>

---

## 🧠 Core Value Proposition

Traditional Security Information and Event Management (SIEM) tools fail against insider attacks because insiders operate using **valid credentials**. Simple threshold-based rules fail to distinguish between legitimate high-volume work and malicious data exfiltration.

TrustMatrix changes the paradigm from:
> ~~"Which static rule did this user violate?"~~  
> **"How anomalous is this entity's current behavior compared to their historical baseline?"**

### Why TrustMatrix Wins:
1. **Dynamic Baselining**: Learns normal working hours, daily byte transfers, authorized devices, and allowed geographies per user/entity.
2. **Multi-Model Anomaly Detection**: Combines **Isolation Forests**, **Autoencoder neural loss**, and statistical z-scores to evaluate telemetry.
3. **Graph Intelligence & Peer Analysis**: Identifies lateral movement and compares anomaly scores against departmental cohorts to suppress noise.
4. **GenAI SOC Copilot & SOAR Playbooks**: Automatically maps threats to **MITRE ATT&CK** techniques and generates actionable, step-by-step remediation playbooks.

<br/>

---

## 🎯 Key Features

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

## ✨ Extra Features (Web & Mobile App)

### 🌐 Extra Features — Web Platform

| Module | What It Does |
|---|---|
| 🤖 **SOC Co-pilot** | LLM-powered assistant (GenAI) to help analysts investigate alerts contextually. |
| 🕸️ **Graph Intelligence** | Maps entity relationships (users, devices, IPs) using network graphs (`networkx`) to detect lateral movement. |
| 👥 **Peer Analysis** | Compares an individual's behavior against their peers or department to identify outliers more accurately. |
| 👻 **Shadow Accounts** | Identifies unmanaged, orphaned, or unauthorized accounts that could be exploited by insiders. |
| 🧠 **NLP Topic Engine** | Uses Latent Dirichlet Allocation (LDA) topic modeling to detect abnormal document content access patterns and sensitive data drift. |
| 📊 **CERT Benchmark Evaluator** | Benchmarks anomaly models against Carnegie Mellon CERT insider threat datasets with Precision, Recall, and ROC-AUC metrics. |
| 🛠️ **SOAR Automated Remediation** | Instant containment playbooks (Host Isolation, Account Lockout, Token Revocation, Force MFA, IP Blocking, File Quarantine) with audit logging. |
| ⚡ **Real-time WebSockets** | Pushes critical alerts to the dashboard instantly via WebSockets for immediate response. |
| 🎯 **Threat Simulator** | Built-in engine to safely simulate realistic insider threat scenarios for continuous testing and validation. |

<br/>

### 📱 Extra Features — Mobile App

| Module | What It Does |
|---|---|
| 📲 **On-the-Go SOC Monitoring** | Real-time push notifications for critical threat alerts and high-risk entity score spikes. |
| ⚡ **1-Click Mobile SOAR Containment** | Execute host isolation, account lockout, or token revocation directly from mobile devices. |
| 🗣️ **Voice-Activated SOC Copilot** | Query AI threat analysis and incident summaries using natural voice inputs on mobile devices. |
| 📊 **Mobile Security Radar** | Compact interactive risk radar and heatmaps specifically optimized for touchscreens. |
| 🔐 **Biometric SOC Authentication** | Secure analyst login via FaceID / Fingerprint biometric authentication for instant access. |

<br/>


---

## 🎨 Next-Gen UI/UX Design System

The frontend (`frontend1`) was built from scratch with a premium aesthetic inspired by **Linear, Vercel, Apple VisionOS, and Arc Browser**:

- **Color Palette**: Deep Black × Electric Violet (`#000000` / `#7c3aed` / `#09090b`).
- **Glassmorphism**: Translucent `.glass-panel` cards with backdrop blurs, subtle borders, and dynamic bottom-glow radiating light effects.
- **Typography**: Complete typography styling using **IBM Plex Serif** imported globally via `@import`.
- **Adaptive Light & Dark Mode**: Sun/Moon theme toggle in the header with high-contrast, beautiful themes for both dark and bright environments.

<br/>

---

## 🏛️ System Architecture

```text
                               ┌─────────────────────────────────────────┐
                               │     TrustMatrix Dual-Platform Ecosystem │
                               └─────────────────────────────────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 │                                                                     │
    ┌────────────▼─────────────┐   ┌──────────────────────────┐     ┌──────────────────▼──────────┐
    │   Next.js 16 Web UI      │   │  Mobile SOC App Client   │     │  FastAPI Backend (Python 3.10)│
    │   (App Router, React 19) │   │  (iOS / Android Touch UI)│     │  http://localhost:8000/api/v1│
    │                          │   │                          │     │                             │
    │  ┌────────────────────┐  │   │  ┌────────────────────┐  │     │  ┌────────────────────────┐ │
    │  │ Overview Dashboard │  │   │  │ Push Notifications │  │     │  │ Log Ingestion & Normal │ │
    │  │ Ingestion Terminal │  ├───┼──┤ 1-Click Mobile SOAR│  ├────►│  ├────────────────────────┤ │
    │  │ Baseline Engine    │  │   │  │ Mobile Risk Radar  │  │     │  │ Baseline & ML Ensemble │ │
    │  │ ML Simulator       │  │   │  │ Voice SOC Copilot  │  │     │  │ (Isolation Forest & AE)│ │
    │  │ GenAI SOC Copilot  │  │   │  └────────────────────┘  │     │  ├────────────────────────┤ │
    │  └────────────────────┘  │   └──────────────────────────┘     │  │ GenAI Copilot & SOAR   │ │
    │  ┌────────────────────┐  │      REST API & WebSockets         │  ├────────────────────────┤ │
    │  │ IBM Plex Serif     │  ├───────────────────────────────────►│  │ Peer & Shadow Accounts │ │
    │  │ Light/Dark Glass   │  │      JSON Telemetry & Alerts       │  └────────────────────────┘ │
    │  └────────────────────┘  │                                    └─────────────────────────────┘
    └──────────────────────────┘
```

<br/>

---

## 💻 Tech Stack

### 🌐 Web Platform (`frontend1`)
- **Framework**: Next.js 16 (React 19, Turbopack)
- **Styling**: Vanilla CSS + Tailwind CSS v4
- **Typography**: IBM Plex Serif
- **Icons**: Lucide React
- **Charts & Visuals**: Chart.js / React-ChartJS-2 / Framer Motion
- **API Integration**: Central `api.ts` module with native `fetch`

### 📱 Mobile App Platform
- **Framework**: React Native / Expo (Cross-platform iOS & Android)
- **Security & Auth**: Biometric Authentication (FaceID / TouchID)
- **Alerts**: Real-time Push Notifications & WebSocket stream
- **Voice AI**: Speech-to-Text integration for Voice SOC Copilot queries

### 🐍 Backend Core (`backend`)
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn ASGI Server
- **ML & Data Science**: `scikit-learn` (Isolation Forest), `numpy`, `pandas`, `PyTorch` (Autoencoder)
- **Graph Intelligence**: `NetworkX`
- **GenAI Copilot**: OpenAI / Google Generative AI integration

### 🚀 CI/CD & Cloud Deployment
- **Backend Cloud Host**: Render (Docker / Python Web Service)
- **Frontend Cloud Host**: Vercel
- **Automated CI Checks**: GitHub Actions (`.github/workflows/frontend-check.yml`)

<br/>

---

## 📁 Repository Structure

```text
AUTONOMOUS-THREAT-HUNTER-FOR-INSIDER-ATTACKS/
├── 📂 .github/workflows/             # CI/CD Automation
│   └── 📄 frontend-check.yml        # GitHub Actions Next.js build & typecheck workflow
├── 📂 frontend1/                     # Next.js 16 Web Dashboard Application
│   ├── 📂 app/                      # App router (globals.css, layout.tsx, page.tsx)
│   ├── 📂 components/               # UI layout components
│   │   ├── Header.tsx               # Top navigation with Sun/Moon theme toggle
│   │   ├── Sidebar.tsx              # Active tab navigation bar
│   │   └── 📂 views/                # Feature views
│   │       ├── OverviewTab.tsx      # Executive threat overview & metrics
│   │       ├── IngestorTab.tsx      # Log ingestion console & pipeline output
│   │       ├── BaselinesTab.tsx     # Entity baseline search & 24h heatmap
│   │       ├── MLSimulatorTab.tsx   # Interactive parameter sliders & ML gauge
│   │       └── CopilotTab.tsx       # GenAI SOC Copilot & remediation playbook
│   ├── 📂 lib/                      # Central API service
│   │   └── api.ts                   # Backend API connection functions
│   └── 📄 package.json              # Next.js dependencies
├── 📂 backend/                      # FastAPI Python Application
│   ├── 📄 requirements.txt          # Python dependencies
│   ├── 📄 Dockerfile                # Render dynamic PORT container setup
│   ├── 📄 Procfile                  # Cloud web worker start configuration
│   ├── 📄 .env                      # Environment config & API keys
│   └── 📂 app/                      # Core backend codebase
│       ├── 📄 main.py               # FastAPI entry point & router registrations
│       ├── 📂 core/                 # Config & security settings
│       └── 📂 features/             # 13 Threat Intelligence Engines
│           ├── 📂 anomaly_detector/ # Isolation Forest & Autoencoder models
│           ├── 📂 baseline_engine/  # Entity profiling & baseline storage
│           ├── 📂 cert_evaluator/   # CERT benchmark dataset evaluator & metrics
│           ├── 📂 graph_intelligence/ # NetworkX relationship mapping & lateral movement
│           ├── 📂 log_ingestor/     # High-speed log ingestion & normalization pipeline
│           ├── 📂 nlp_topic_engine/ # LDA topic modeling for document access drift
│           ├── 📂 peer_analysis/    # Peer cohort outlier detection
│           ├── 📂 risk_engine/      # Composite risk scoring engine
│           ├── 📂 shadow_accounts/  # Unmanaged/orphaned account discovery
│           ├── 📂 soar_remediation/ # Active containment playbooks & audit logging
│           ├── 📂 soc_copilot/      # GenAI explanation & triage engine
│           ├── 📂 threat_simulator/ # Simulated attack vector generation
│           └── 📂 websocket_alerts/ # Real-time alert streaming
└── 📄 README.md                     # Hackathon project documentation
```

<br/>

---

## ⚡ Local Quickstart Guide for Judges

Follow these simple steps to run both the **Backend** and **Web Frontend** on your local machine for evaluation.

### Prerequisites
- **Python**: Version 3.10 or higher installed
- **Node.js**: Version 18.0 or higher installed

---

### Step 1: Start the FastAPI Backend

Open a terminal and execute:

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
# Windows (PowerShell):
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS:
# python3 -m venv venv
# source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Start the backend server
uvicorn app.main:app --reload --port 8000
```

> 🟢 **Backend API Verification**: Open `http://localhost:8000/health` or `http://localhost:8000/docs` in your browser to verify that the Swagger UI & API endpoints are active.

---

### Step 2: Start the Next.js Web Platform

Open a **second terminal** and execute:

```bash
# 1. Navigate to the frontend directory
cd frontend1

# 2. Install Node dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

> 🟢 **Web UI Verification**: Open `http://localhost:3000` in your browser. The dashboard will load with full Light/Dark mode support and live API connectivity to your local backend.

<br/>

---

## 🎬 Judge Demonstration Walkthrough

To experience the full capabilities of **TrustMatrix** during evaluation, follow this 4-step testing walkthrough:

### Step 1: Inspect Entity Baselines (`Baselines Tab`)
1. Click on **Baselines** in the sidebar.
2. In the search bar, type `admin_user` and click **Retrieve Profile** (or press Enter).
3. **What to observe**: The frontend makes a live call to `GET /api/v1/baseline/admin_user`. The user's baseline card renders their **Average Daily Bytes**, **Max Daily Threshold**, and an interactive 24-hour **Typical Working Hours** heatmap.
4. Click **Recalculate Baseline** to test live profile recalculation.

### Step 2: Transmit Live Telemetry (`Log Ingestor Tab`)
1. Click on **Log Ingestor** in the sidebar.
2. Select a template (e.g., *Windows: Successful Login*) or enter custom telemetry in the JSON editor.
3. Click **Transmit Log Batch to Pipeline**.
4. **What to observe**: The log ingestion terminal streams progress outputs directly to the output log window via `POST /api/v1/ingest/`.

### Step 3: Run the ML Ensemble Simulator (`ML Simulator Tab`)
1. Click on **ML Simulator** in the sidebar.
2. Adjust the sliders to simulate suspicious behavior:
   - **Login Hour**: `3` (3:00 AM)
   - **Failed Login Ratio (%)**: `45%`
   - **Bytes Transferred (KB)**: `85,000 KB`
   - **Admin Commands**: `8`
3. Click **Execute ML Ensemble Evaluation**.
4. **What to observe**: The frontend posts features to `POST /api/v1/anomaly/analyze`. The ring gauge animates, the status switches to **ANOMALY DETECTED**, and the **Isolation Forest Score** and **Autoencoder Loss** calculate in real time.

### Step 4: Trigger the GenAI SOC Copilot & SOAR Playbook (`AI SOC Copilot Tab`)
1. Click on **AI SOC Copilot** in the sidebar.
2. Review the pre-populated investigation context (Target User: `admin_user`, Risk Score: `84`, Indicators: `Late hour activity, Massive data transfer`).
3. Click **Ask AI SOC Copilot to Explain**.
4. **What to observe**: The GenAI engine processes the request via `POST /api/v1/copilot/explain`. It generates an **Executive Summary**, maps suspected tactics to **MITRE ATT&CK** (`T1078`, `T1048.002`), and renders an **Actionable Incident Response Playbook** with numbered remediation steps.

<br/>

---

## 📡 API Reference

Below are the core REST API endpoints hosted at `http://localhost:8000/api/v1`:

| Endpoint | Method | Feature | Description |
|---|---|---|---|
| `/health` | `GET` | System | Health check & list of active feature engines |
| `/api/v1/ingest/` | `POST` | Ingestion | Ingest raw telemetry log payloads |
| `/api/v1/baseline/{username}` | `GET` | Baselines | Fetch historical behavior profile & metrics |
| `/api/v1/baseline/{username}/recalculate` | `POST` | Baselines | Recalculate baseline with new event stream |
| `/api/v1/anomaly/analyze` | `POST` | ML Engine | Run Isolation Forest & Autoencoder evaluation |
| `/api/v1/copilot/explain` | `POST` | GenAI SOC | Generate threat summary & response playbooks |
| `/api/v1/nlp/analyze-topics` | `POST` | NLP Engine | Perform LDA topic extraction & sensitive drift analysis |
| `/api/v1/benchmark/evaluate` | `POST` | CERT Benchmark | Evaluate anomaly detection against CERT datasets |
| `/api/v1/remediation/isolate-host` | `POST` | SOAR Playbooks | Trigger active host isolation & containment |
| `/api/v1/remediation/lock-user` | `POST` | SOAR Playbooks | Lock out compromised account & revoke active tokens |
| `/api/v1/risk/alerts` | `GET` | Risk Engine | Fetch prioritized risk alerts |

<br/>

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

<br/>

---

<div align="center">

**Built for Modern Security Operations Centers**  
*Autonomous Threat Hunting Powered by Machine Learning & Generative AI.*

</div>
