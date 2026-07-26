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

### *The Autonomous Intelligence Layer for Insider Threat Detection & UEBA AI SOC Platform*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.11-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-FFD43B?style=for-the-badge&logo=python&logoColor=black)](https://python.org)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge&color=dea127)](./LICENSE)

<br/>

> **TrustMatrix** is a Next-Gen User & Entity Behavior Analytics (UEBA) and Autonomous Threat Hunting Platform built for modern Security Operations Centers (SOCs). 
> Instead of relying on static SIEM rules that flood analysts with false positives, TrustMatrix continuously profiles entity behavior using machine learning ensemble models (Isolation Forests, Autoencoders), Graph Intelligence, NLP topic extraction, and Generative AI SOC Copilot for instant threat explainability and SOAR remediation.

<br/>

---

</div>

<br/>

## 📌 Table of Contents

- [🧠 Core Value Proposition](#-core-value-proposition)
- [🎯 Key Features & Modules](#-key-features--modules)
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

## 🎯 Key Features & Modules

### 1. 🗂️ Universal Log Ingestor & Normalizer
- Continuously ingests raw telemetry logs across Windows Event Logs (`EventID 4624`, `4625`), Linux SSH logs, Network VPN traces, and cloud API access.
- Normalizes unstructured/semi-structured logs into standard JSON schema for real-time feature extraction.

### 2. 🔬 Behavioral Baseline Engine
- Maintains living entity profiles storing average daily bytes, max threshold bounds, typical active hours (24-hour heatmap), allowed locations, authorized devices, and frequent binaries.
- Supports manual and automated profile recalculation based on incoming log streams.

### 3. 📏 ML Ensemble Anomaly Detector
- Evaluates behavior across high-dimensional feature vectors: login hours, failed login ratios, byte volume, admin command counts, and unique device footprints.
- Runs **Isolation Forest** and **Autoencoder** anomaly detection models to calculate composite risk scores (0–100%).

### 4. 🤖 AI SOC Copilot (GenAI Engine)
- Context-aware threat analyst powered by LLMs.
- Accepts anomaly scores, flagged indicators, and raw activity trace summaries to produce:
  - **Executive Threat Summaries**
  - **Suspected MITRE ATT&CK Tactics Map** (`T1078 Valid Accounts`, `T1048.002 Exfiltration`)
  - **Actionable Incident Response Playbooks**

### 5. 👥 Peer Cohort Analysis & Shadow Accounts
- Benchmarks individual activity against peer groups to eliminate organization-wide false alarms (e.g., DevOps running batch jobs at night).
- Identifies unmanaged or orphaned "shadow accounts" susceptible to privilege escalation.

### 6. ⚡ SOAR & CERT Benchmark Evaluator
- Generates automated remediation steps (Active Directory account lockout, VPN session termination, endpoint isolation).
- Benchmark evaluator built for CERT dataset compatibility.

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
                               │           TrustMatrix Platform          │
                               └─────────────────────────────────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 │                                                                     │
    ┌────────────▼─────────────┐                             ┌─────────────────────────▼──────────┐
    │   Next.js 16 Frontend    │                             │      FastAPI Backend (Python 3.10+) │
    │   (App Router, React 19) │                             │      http://localhost:8000/api/v1  │
    │                          │                             │                                    │
    │  ┌────────────────────┐  │   REST API Requests (api.ts)│  ┌──────────────────────────────┐  │
    │  │ Overview Dashboard │  ├────────────────────────────┼─►│ Log Ingestion & Normalizer   │  │
    │  │ Ingestion Terminal │  │                             │  ├──────────────────────────────┤  │
    │  │ Baseline Engine    │  │                             │  │ Baseline Engine              │  │
    │  │ ML Simulator       │  │                             │  ├──────────────────────────────┤  │
    │  │ GenAI SOC Copilot  │  │◄────────────────────────────┼──┤ ML Ensemble (Isolation       │  │
    │  └────────────────────┘  │   JSON Telemetry & Reports  │  │ Forest & Autoencoders)       │  │
    │  ┌────────────────────┐  │                             │  ├──────────────────────────────┤  │
    │  │ IBM Plex Serif     │  │                             │  │ GenAI SOC Copilot & SOAR     │  │
    │  │ Light/Dark Glass   │  │                             │  ├──────────────────────────────┤  │
    │  └────────────────────┘  │                             │  │ Peer Analysis & Shadow Accts │  │
    └──────────────────────────┘                             │  └──────────────────────────────┘  │
                                                             └────────────────────────────────────┘
```

<br/>

---

## 💻 Tech Stack

### Frontend (`frontend1`)
- **Framework**: Next.js 16 (React 19)
- **Styling**: Vanilla CSS + Tailwind CSS v4
- **Typography**: IBM Plex Serif
- **Icons**: Lucide React
- **Charts & Visuals**: Chart.js / React-ChartJS-2 / Framer Motion
- **API Integration**: Custom central `api.ts` module with native `fetch`

### Backend (`backend`)
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn ASGI Server
- **ML & Data Science**: `scikit-learn` (Isolation Forest), `numpy`, `pandas`
- **Graph Intelligence**: `NetworkX`
- **GenAI Copilot**: OpenAI / Google Generative AI integration

<br/>

---

## 📁 Repository Structure

```text
AUTONOMOUS-THREAT-HUNTER-FOR-INSIDER-ATTACKS/
├── 📂 frontend1/                     # Next.js 16 Futuristic UI
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
│   ├── 📄 .env                      # Environment config & API keys
│   └── 📂 app/                      # Core backend codebase
│       ├── 📄 main.py               # FastAPI entry point & router registrations
│       ├── 📂 core/                 # Config & security settings
│       └── 📂 features/             # Threat Intelligence Engines
│           ├── 📂 anomaly_detector/ # Isolation Forest & Autoencoder models
│           ├── 📂 baseline_engine/  # Entity profiling & baseline storage
│           ├── 📂 log_ingestor/     # High-speed data ingest pipeline
│           ├── 📂 soc_copilot/      # GenAI explanation engine
│           ├── 📂 risk_engine/      # Composite risk scoring
│           ├── 📂 peer_analysis/    # Peer cohort outlier detection
│           ├── 📂 shadow_accounts/  # Orphaned account discovery
│           └── 📂 soar_remediation/ # Response playbooks
└── 📄 README.md                     # Hackathon project documentation
```

<br/>

---

## ⚡ Local Quickstart Guide for Judges

Follow these simple steps to run both the **Backend** and **Frontend** on your local machine for evaluation.

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

### Step 2: Start the Next.js Frontend

Open a **second terminal** and execute:

```bash
# 1. Navigate to the frontend directory
cd frontend1

# 2. Install Node dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

> 🟢 **Frontend UI Verification**: Open `http://localhost:3000` in your browser. The dashboard will load with full Light/Dark mode support and live API connectivity to your local backend.

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
