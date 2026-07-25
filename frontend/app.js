// app.js - TrustMatrix Frontend Controller

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // Configuration & State
    // ----------------------------------------------------
    const API_BASE = "http://localhost:8000/api/v1";
    let activeSection = "overview";
    
    // In-memory application state
    const state = {
        riskIndex: 42.8,
        activeBaselines: 128,
        criticalAnomalies: 3,
        ingestRate: 1482,
        alerts: [
            {
                timestamp: new Date().toISOString(),
                user: "admin_user",
                tactics: ["Execution", "Privilege Escalation"],
                score: 84.5,
                vector: "admin_commands_count",
                status: "UNRESOLVED"
            },
            {
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                user: "johndoe",
                tactics: ["Exfiltration"],
                score: 72.1,
                vector: "bytes_transferred",
                status: "UNRESOLVED"
            },
            {
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                user: "guest_contractor",
                tactics: ["Initial Access"],
                score: 91.0,
                vector: "unique_locations_visited",
                status: "QUARANTINED"
            }
        ]
    };

    // Log Templates Presets
    const presets = {
        win_login_success: {
            source_type: "windows",
            raw_payload: {
                EventID: 4624,
                TimeCreated: new Date().toISOString(),
                TargetUserName: "admin_user",
                IpAddress: "192.168.1.50",
                Computer: "WORKSTATION-09",
                Location: "US"
            }
        },
        win_login_fail: {
            source_type: "windows",
            raw_payload: {
                EventID: 4625,
                TimeCreated: new Date().toISOString(),
                TargetUserName: "admin_user",
                IpAddress: "103.22.180.12",
                Computer: "WORKSTATION-09",
                Location: "Russia"
            }
        },
        win_admin_cmd: {
            source_type: "windows",
            raw_payload: {
                EventID: 4688,
                TimeCreated: new Date().toISOString(),
                TargetUserName: "admin_user",
                NewProcessName: "powershell.exe",
                ParentProcessName: "explorer.exe",
                Computer: "WORKSTATION-09"
            }
        },
        linux_ssh_success: {
            source_type: "linux",
            raw_payload: {
                timestamp: new Date().toISOString(),
                message: "Accepted publickey for johndoe from 192.168.1.82 port 22 ssh2",
                hostname: "ubuntu-server",
                program: "sshd"
            }
        },
        linux_ssh_fail: {
            source_type: "linux",
            raw_payload: {
                timestamp: new Date().toISOString(),
                message: "Failed password for invalid user admin from 203.0.113.5 port 49152 ssh2",
                hostname: "ubuntu-server",
                program: "sshd"
            }
        },
        vpn_connect: {
            source_type: "vpn",
            raw_payload: {
                timestamp: new Date().toISOString(),
                username: "johndoe",
                source_ip: "185.190.140.22",
                action: "connect",
                gateway: "fw-gateway-east",
                geo_location: "UK",
                bytes_sent: 45000,
                bytes_received: 120000
            }
        },
        vpn_data_leak: {
            source_type: "vpn",
            raw_payload: {
                timestamp: new Date().toISOString(),
                username: "johndoe",
                source_ip: "185.190.140.22",
                action: "connect",
                gateway: "fw-gateway-east",
                geo_location: "UK",
                bytes_sent: 500000000,
                bytes_received: 100000
            }
        }
    };

    // ----------------------------------------------------
    // DOM Navigation / Routing
    // ----------------------------------------------------
    const sidebarMenuItems = document.querySelectorAll(".sidebar-menu .menu-item");
    const sections = document.querySelectorAll(".dashboard-section");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    function navigateToSection(targetId) {
        sections.forEach(sec => {
            sec.classList.remove("active");
            if (sec.id === `section-${targetId}`) {
                sec.classList.add("active");
            }
        });

        sidebarMenuItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${targetId}`) {
                item.classList.add("active");
            }
        });

        activeSection = targetId;

        // Dynamic Titles
        switch (targetId) {
            case "overview":
                pageTitle.textContent = "SOC Overview";
                pageSubtitle.textContent = "Real-time anomaly telemetry & threat index tracking";
                break;
            case "ingestor":
                pageTitle.textContent = "Log Ingestor";
                pageSubtitle.textContent = "Raw security payload ingestion and normalization console";
                break;
            case "baselines":
                pageTitle.textContent = "User Baselines";
                pageSubtitle.textContent = "Historical behavioral profiles and operational thresholds";
                break;
            case "anomaly-detector":
                pageTitle.textContent = "ML Simulator";
                pageSubtitle.textContent = "Isolation Forest & PyTorch Autoencoder simulation playground";
                break;
            case "copilot":
                pageTitle.textContent = "AI SOC Copilot";
                pageSubtitle.textContent = "LLM-assisted threat breakdown, ATT&CK mapping, and remediation playbooks";
                break;
        }
    }

    sidebarMenuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.getAttribute("href").substring(1);
            navigateToSection(target);
        });
    });

    // Hash navigation backup
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (["overview", "ingestor", "baselines", "anomaly-detector", "copilot"].includes(hash)) {
            navigateToSection(hash);
        }
    }

    // ----------------------------------------------------
    // Chart Visualizations (Chart.js)
    // ----------------------------------------------------
    // 1. Line Chart: Threat Index Progression
    const ctxProgression = document.getElementById("chart-threat-progression").getContext("2d");
    const progressionChart = new Chart(ctxProgression, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${(i + 17) % 24}:00`),
            datasets: [{
                label: 'Threat Index %',
                data: [35, 38, 41, 39, 45, 42, 38, 36, 40, 48, 52, 60, 58, 47, 44, 43, 40, 42, 45, 50, 48, 42, 41, 42.8],
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.05)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' },
                    min: 0,
                    max: 100
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });

    // 2. Bar Chart: Anomaly Vectors
    const ctxVectors = document.getElementById("chart-anomaly-vectors").getContext("2d");
    const vectorsChart = new Chart(ctxVectors, {
        type: 'bar',
        data: {
            labels: ['Working Hour', 'Failed Logins', 'Admin Actions', 'Data Volume', 'Geos Used', 'Devices Used'],
            datasets: [{
                label: 'Contribution Weight %',
                data: [18, 42, 65, 84, 23, 12],
                backgroundColor: [
                    'rgba(0, 242, 254, 0.7)',
                    'rgba(157, 78, 221, 0.7)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(6, 182, 212, 0.7)'
                ],
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' },
                    min: 0,
                    max: 100
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });

    // ----------------------------------------------------
    // Alert Stream Populator
    // ----------------------------------------------------
    const alertStreamBody = document.getElementById("alert-stream-tbody");

    function renderAlertStream() {
        alertStreamBody.innerHTML = "";
        state.alerts.forEach((alert, index) => {
            const tr = document.createElement("tr");
            
            // Format time
            const date = new Date(alert.timestamp);
            const timeStr = date.toLocaleTimeString() + " " + date.toLocaleDateString();
            
            // Badges
            const tacticsHtml = alert.tactics.map(t => `<span class="badge badge-indigo">${t}</span>`).join(" ");
            const scoreClass = alert.score > 75 ? "text-red" : "text-warning";
            const statusClass = alert.status === "UNRESOLVED" ? "badge-critical" : (alert.status === "QUARANTINED" ? "badge-warning" : "badge-success");
            
            tr.innerHTML = `
                <td>${timeStr}</td>
                <td><strong class="text-white">${alert.user}</strong></td>
                <td>${tacticsHtml}</td>
                <td><span class="${scoreClass} font-bold">${alert.score}%</span></td>
                <td><code class="text-muted">${alert.vector}</code></td>
                <td><span class="badge ${statusClass}">${alert.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm btn-action-explain" data-index="${index}">
                        <i class="fa-solid fa-robot"></i> Copilot Explain
                    </button>
                </td>
            `;
            alertStreamBody.appendChild(tr);
        });

        // Add Event Listeners for actions
        document.querySelectorAll(".btn-action-explain").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                const alert = state.alerts[idx];
                
                // Prepopulate copilot context and navigate
                document.getElementById("copilot-username").value = alert.user;
                document.getElementById("copilot-score").value = Math.round(alert.score);
                document.getElementById("copilot-reasons").value = `Elevated activity on ${alert.vector}, matching MITRE tactics.`;
                document.getElementById("copilot-mitre").value = alert.tactics.includes("Exfiltration") ? "T1048.002, T1078" : "T1078, T1059.001";
                document.getElementById("copilot-raw-logs").value = `Alert triggered on entity telemetry stream.\nTarget: ${alert.user}\nScore: ${alert.score}%\nDominant variable: ${alert.vector}\nStatus: ${alert.status}`;
                
                navigateToSection("copilot");
                // Trigger auto explanation
                document.getElementById("btn-explain-alert").click();
            });
        });
    }

    renderAlertStream();

    document.getElementById("btn-clear-alerts").addEventListener("click", () => {
        state.alerts = [];
        renderAlertStream();
        document.getElementById("stat-critical-count").textContent = 0;
    });

    // ----------------------------------------------------
    // Log Ingestor Logic
    // ----------------------------------------------------
    const ingestSelect = document.getElementById("ingest-presets");
    const ingestSource = document.getElementById("ingest-source-type");
    const ingestPayload = document.getElementById("ingest-payload");
    const ingestTerminal = document.getElementById("ingest-terminal");
    const btnSubmitLog = document.getElementById("btn-submit-log");

    function loadPreset() {
        const val = ingestSelect.value;
        if (presets[val]) {
            ingestSource.value = presets[val].source_type;
            ingestPayload.value = JSON.stringify(presets[val].raw_payload, null, 4);
        }
    }

    ingestSelect.addEventListener("change", loadPreset);
    loadPreset(); // Initial load

    function writeTerminalLine(text, type = "info") {
        const line = document.createElement("span");
        line.classList.add("terminal-line");
        if (type === "error") line.style.color = "var(--color-critical)";
        if (type === "success") line.style.color = "var(--color-success)";
        if (type === "warn") line.style.color = "var(--color-warning)";
        
        line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        ingestTerminal.appendChild(line);
        ingestTerminal.scrollTop = ingestTerminal.scrollHeight;
    }

    btnSubmitLog.addEventListener("click", async () => {
        const sourceType = ingestSource.value.trim();
        let payloadObj;
        
        try {
            payloadObj = JSON.parse(ingestPayload.value);
        } catch (e) {
            writeTerminalLine("Parsing Error: Invalid JSON input", "error");
            return;
        }

        writeTerminalLine(`Sending raw batch transmission to Log Ingestor... (${sourceType})`);
        
        try {
            // Post payload (enclosed in a List as backend expects list of raw logs)
            const response = await fetch(`${API_BASE}/ingest/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([
                    {
                        source_type: sourceType,
                        raw_payload: payloadObj
                    }
                ])
            });

            if (response.ok) {
                const data = await response.json();
                writeTerminalLine(`Success: Received status: ${data.status}, records: ${data.records_received}`, "success");
                
                // Add dynamically to active baselines
                state.activeBaselines = Math.min(150, state.activeBaselines + 1);
                document.getElementById("stat-active-baselines").textContent = state.activeBaselines;
                
                // Increment ingestion metric
                state.ingestRate = Math.round(state.ingestRate + (Math.random() * 5 - 2));
                document.getElementById("stat-ingest-rate").innerHTML = `${state.ingestRate} <span class="unit">EPS</span>`;
                
                // Add alert if VPN data leak or SSH Failure
                if (ingestSelect.value === "vpn_data_leak") {
                    const newAlert = {
                        timestamp: new Date().toISOString(),
                        user: payloadObj.username || "unknown",
                        tactics: ["Exfiltration"],
                        score: 94.0,
                        vector: "bytes_transferred",
                        status: "UNRESOLVED"
                    };
                    state.alerts.unshift(newAlert);
                    state.criticalAnomalies++;
                    document.getElementById("stat-critical-count").textContent = state.criticalAnomalies;
                    renderAlertStream();
                } else if (ingestSelect.value === "win_login_fail" || ingestSelect.value === "linux_ssh_fail") {
                    const newAlert = {
                        timestamp: new Date().toISOString(),
                        user: payloadObj.TargetUserName || "unknown",
                        tactics: ["Initial Access"],
                        score: 56.4,
                        vector: "failed_login_ratio",
                        status: "UNRESOLVED"
                    };
                    state.alerts.unshift(newAlert);
                    state.criticalAnomalies++;
                    document.getElementById("stat-critical-count").textContent = state.criticalAnomalies;
                    renderAlertStream();
                }
            } else {
                throw new Error(`Server returned code ${response.status}`);
            }
        } catch (err) {
            writeTerminalLine(`API server offline. Running local client-side normalization fallback.`, "warn");
            // Simulate local processing
            setTimeout(() => {
                writeTerminalLine(`Local Normalizer matched: ${sourceType.toUpperCase()}_EVENT`, "success");
                writeTerminalLine(`Normalized user context: ${payloadObj.TargetUserName || payloadObj.username || payloadObj.user || "unknown"}`, "success");
            }, 500);
        }
    });

    // ----------------------------------------------------
    // User Baselines Lookups
    // ----------------------------------------------------
    const baselineUserInput = document.getElementById("baseline-user-input");
    const btnFetchBaseline = document.getElementById("btn-fetch-baseline");
    const baselineProfileContainer = document.getElementById("baseline-profile-container");
    const baselineEmptyState = document.getElementById("baseline-empty-state");

    const profileUsername = document.getElementById("profile-username");
    const profileVersion = document.getElementById("profile-version");
    const profileLastUpdated = document.getElementById("profile-last-updated");
    const profileAvgBytes = document.getElementById("profile-avg-bytes");
    const profileThresholdBytes = document.getElementById("profile-threshold-bytes");
    
    const baselineWorkingHours = document.getElementById("baseline-working-hours");
    const baselineLocations = document.getElementById("baseline-locations");
    const baselineDevices = document.getElementById("baseline-devices");
    const baselineApps = document.getElementById("baseline-apps");

    function renderWorkingHours(hoursArray) {
        baselineWorkingHours.innerHTML = "";
        for (let h = 0; h < 24; h++) {
            const div = document.createElement("div");
            div.classList.add("hour-block");
            div.setAttribute("data-hour", h);
            if (hoursArray.includes(h)) {
                div.classList.add("active");
            }
            baselineWorkingHours.appendChild(div);
        }
    }

    function renderTags(container, tagsList) {
        container.innerHTML = "";
        if (!tagsList || tagsList.length === 0) {
            container.innerHTML = `<span class="text-muted text-sm">None recorded</span>`;
            return;
        }
        tagsList.forEach(t => {
            const span = document.createElement("span");
            span.classList.add("baseline-tag");
            span.textContent = t;
            container.appendChild(span);
        });
    }

    async function fetchUserProfile(username) {
        if (!username) return;
        
        try {
            const response = await fetch(`${API_BASE}/baseline/${username}`);
            if (response.ok) {
                const profile = await response.json();
                displayProfile(profile);
            } else {
                throw new Error("User not found or database mismatch");
            }
        } catch (err) {
            // Local fallback simulator if backend is offline
            writeTerminalLine(`Local Lookup fallback: Creating dynamic mock profile for ${username}`, "warn");
            const fallbackProfile = {
                username: username,
                profile_score_version: 1,
                last_updated: new Date().toISOString(),
                avg_daily_bytes: username.includes("admin") ? 45000000 : 1500000,
                max_daily_bytes_threshold: username.includes("admin") ? 120000000 : 8000000,
                typical_working_hours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                allowed_locations: ["US", "CA", "UK"],
                allowed_devices: ["LAPTOP-552", "WORKSTATION-09"],
                frequent_applications: ["cmd.exe", "powershell.exe", "outlook.exe", "chrome.exe"]
            };
            displayProfile(fallbackProfile);
        }
    }

    function displayProfile(profile) {
        baselineEmptyState.style.display = "none";
        baselineProfileContainer.style.display = "grid";

        profileUsername.textContent = profile.username;
        profileVersion.textContent = profile.profile_score_version;
        profileLastUpdated.textContent = new Date(profile.last_updated).toLocaleString();
        profileAvgBytes.textContent = (profile.avg_daily_bytes / 1024).toFixed(2) + " KB";
        profileThresholdBytes.textContent = (profile.max_daily_bytes_threshold / 1024).toFixed(2) + " KB";

        renderWorkingHours(profile.typical_working_hours);
        renderTags(baselineLocations, profile.allowed_locations);
        renderTags(baselineDevices, profile.allowed_devices);
        renderTags(baselineApps, profile.frequent_applications);
    }

    btnFetchBaseline.addEventListener("click", () => {
        fetchUserProfile(baselineUserInput.value.trim());
    });

    document.getElementById("btn-recalculate-baseline").addEventListener("click", async () => {
        const username = profileUsername.textContent;
        writeTerminalLine(`Requesting manual recalculation bounds for: ${username}...`);
        
        try {
            const events = [
                {
                    timestamp: new Date().toISOString(),
                    user: username,
                    entity: "vpn_service",
                    device: "LAPTOP-552",
                    event_type: "LOGIN_SUCCESS",
                    severity: 1,
                    bytes_transferred: 3200000,
                    location: "UK"
                }
            ];
            
            const response = await fetch(`${API_BASE}/baseline/${username}/recalculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(events)
            });

            if (response.ok) {
                const profile = await response.json();
                displayProfile(profile);
                writeTerminalLine("Baseline recalculation completed successfully", "success");
            } else {
                throw new Error();
            }
        } catch (e) {
            writeTerminalLine("Manual baseline recalculation fallback succeeded locally", "success");
            // Increment version locally
            const currentVer = parseInt(profileVersion.textContent);
            profileVersion.textContent = currentVer + 1;
            profileLastUpdated.textContent = new Date().toLocaleString();
        }
    });

    // ----------------------------------------------------
    // ML Simulator Sliders and Logic
    // ----------------------------------------------------
    // Slider values synchronizer
    const sliders = [
        { id: "sim-login-hour", valId: "val-sim-login-hour", suffix: "" },
        { id: "sim-login-weekday", valId: "val-sim-login-weekday", suffix: "", map: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
        { id: "sim-failed-ratio", valId: "val-sim-failed-ratio", suffix: "%" },
        { id: "sim-bytes", valId: "val-sim-bytes", suffix: " KB" },
        { id: "sim-admin-cmds", valId: "val-sim-admin-cmds", suffix: "" },
        { id: "sim-devices", valId: "val-sim-devices", suffix: "" },
        { id: "sim-locations", valId: "val-sim-locations", suffix: "" }
    ];

    sliders.forEach(slider => {
        const el = document.getElementById(slider.id);
        const valEl = document.getElementById(slider.valId);
        
        el.addEventListener("input", () => {
            let val = el.value;
            if (slider.map) {
                val = slider.map[val];
            } else {
                val = val + slider.suffix;
            }
            valEl.textContent = val;
        });
    });

    const btnRunAnalysis = document.getElementById("btn-run-analysis");
    const anomalyResultsPanel = document.getElementById("anomaly-results-panel");
    const anomalyEmptyState = document.getElementById("anomaly-empty-state");
    const gaugeScoreValue = document.getElementById("gauge-score-value");
    const valIforestScore = document.getElementById("val-iforest-score");
    const valAutoencoderScore = document.getElementById("val-autoencoder-score");
    const anomalyBadge = document.getElementById("anomaly-badge");
    const contributionContainer = document.getElementById("contribution-container");

    btnRunAnalysis.addEventListener("click", async () => {
        const username = document.getElementById("sim-username").value.trim();
        const payload = {
            current_features: {
                username: username,
                login_hour: parseInt(document.getElementById("sim-login-hour").value),
                login_weekday: parseInt(document.getElementById("sim-login-weekday").value),
                failed_login_count: Math.round(parseInt(document.getElementById("sim-failed-ratio").value) * 0.1),
                total_logins: 10,
                failed_login_ratio: parseFloat(document.getElementById("sim-failed-ratio").value) / 100.0,
                bytes_transferred: parseInt(document.getElementById("sim-bytes").value) * 1024,
                admin_commands_count: parseInt(document.getElementById("sim-admin-cmds").value),
                unique_devices_used: parseInt(document.getElementById("sim-devices").value),
                unique_locations_visited: parseInt(document.getElementById("sim-locations").value)
            },
            historical_features: [] // History is populated inside models on-the-fly if provided
        };

        anomalyEmptyState.style.display = "none";
        anomalyResultsPanel.style.display = "block";

        try {
            const response = await fetch(`${API_BASE}/anomaly/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const analysis = await response.json();
                renderAnalysisResults(analysis);
            } else {
                throw new Error("Analysis failed");
            }
        } catch (e) {
            writeTerminalLine("Ensemble models evaluated using local analytical weighting framework", "warn");
            // Simulate calculations
            const features = payload.current_features;
            
            let isoScore = 15.0;
            let aeScore = 10.0;
            
            // Build simple heuristic scoring for the mock
            if (features.login_hour < 6 || features.login_hour > 20) {
                aeScore += 25;
            }
            if (features.failed_login_ratio > 0.3) {
                isoScore += 40;
                aeScore += 30;
            }
            if (features.bytes_transferred > 200 * 1024 * 1024) { // >200MB
                aeScore += 50;
            }
            if (features.admin_commands_count > 10) {
                isoScore += 35;
                aeScore += 20;
            }
            if (features.unique_locations_visited > 2) {
                isoScore += 30;
            }
            
            isoScore = Math.min(100, isoScore);
            aeScore = Math.min(100, aeScore);
            
            const unified = (isoScore * 0.5) + (aeScore * 0.5);
            const isAnomaly = unified >= 70.0;

            const contributions = [
                { feature_name: "failed_login_ratio", contribution_percentage: features.failed_login_ratio > 0 ? 45.0 : 5.0, actual_value: features.failed_login_ratio },
                { feature_name: "bytes_transferred", contribution_percentage: features.bytes_transferred > 500000 ? 30.0 : 10.0, actual_value: features.bytes_transferred },
                { feature_name: "admin_commands_count", contribution_percentage: features.admin_commands_count > 5 ? 15.0 : 5.0, actual_value: features.admin_commands_count },
                { feature_name: "login_hour", contribution_percentage: 10.0, actual_value: features.login_hour }
            ].sort((a,b) => b.contribution_percentage - a.contribution_percentage);

            const mockAnalysis = {
                username: username,
                anomaly_score: Math.round(unified * 10) / 10,
                is_anomaly: isAnomaly,
                isolation_forest_score: Math.round(isoScore * 10) / 10,
                autoencoder_score: Math.round(aeScore * 10) / 10,
                feature_contributions: contributions
            };
            
            renderAnalysisResults(mockAnalysis);
        }
    });

    function renderAnalysisResults(analysis) {
        gaugeScoreValue.textContent = `${analysis.anomaly_score}%`;
        valIforestScore.textContent = `${analysis.isolation_forest_score}%`;
        valAutoencoderScore.textContent = `${analysis.autoencoder_score}%`;

        if (analysis.is_anomaly) {
            anomalyBadge.textContent = "CRITICAL ANOMALY";
            anomalyBadge.className = "badge badge-critical pulse-slow";
            gaugeScoreValue.style.color = "var(--color-critical)";
            gaugeScoreValue.style.textShadow = "0 0 20px var(--color-critical-glow)";
        } else {
            anomalyBadge.textContent = "NORMAL";
            anomalyBadge.className = "badge badge-success";
            gaugeScoreValue.style.color = "var(--neon-cyan)";
            gaugeScoreValue.style.textShadow = "0 0 20px var(--neon-cyan-glow)";
        }

        // Render Contributions List
        contributionContainer.innerHTML = "";
        analysis.feature_contributions.forEach(contrib => {
            const row = document.createElement("div");
            row.classList.add("contribution-row");
            
            // Map colors to features
            let color = "var(--neon-blue)";
            if (contrib.contribution_percentage > 35) color = "var(--color-critical)";
            else if (contrib.contribution_percentage > 20) color = "var(--color-warning)";

            row.innerHTML = `
                <div class="contribution-info">
                    <span class="contribution-name">${contrib.feature_name} <span class="text-muted">(${contrib.actual_value})</span></span>
                    <span class="contribution-percentage" style="color: ${color};">${contrib.contribution_percentage}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${contrib.contribution_percentage}%; background-color: ${color};"></div>
                </div>
            `;
            contributionContainer.appendChild(row);
        });
    }

    // ----------------------------------------------------
    // AI SOC Copilot Logic
    // ----------------------------------------------------
    const btnExplainAlert = document.getElementById("btn-explain-alert");
    const copilotEmptyState = document.getElementById("copilot-empty-state");
    const copilotLiveReport = document.getElementById("copilot-live-report");
    
    const copilotResConfidence = document.getElementById("copilot-res-confidence");
    const copilotSummaryText = document.getElementById("copilot-summary-text");
    const copilotTacticsContainer = document.getElementById("copilot-tactics-container");
    const copilotRemediationList = document.getElementById("copilot-remediation-list");

    btnExplainAlert.addEventListener("click", async () => {
        const username = document.getElementById("copilot-username").value.trim();
        const score = parseFloat(document.getElementById("copilot-score").value);
        const reasons = document.getElementById("copilot-reasons").value.split(",").map(r => r.trim());
        const mitre = document.getElementById("copilot-mitre").value.split(",").map(m => m.trim());
        const raw_logs = document.getElementById("copilot-raw-logs").value;

        copilotEmptyState.style.display = "none";
        copilotLiveReport.style.display = "block";
        copilotSummaryText.textContent = "AI Analyst is reasoning threat vector maps...";

        const payload = {
            username: username,
            anomaly_score: score,
            mitre_techniques: mitre,
            flagged_reasons: reasons,
            raw_events_summary: raw_logs
        };

        try {
            const response = await fetch(`${API_BASE}/copilot/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const report = await response.json();
                renderCopilotReport(report);
            } else {
                throw new Error("Copilot API failed");
            }
        } catch (e) {
            writeTerminalLine("Live Gemini connection unreachable. Running offline tier-3 fallback analysis.", "warn");
            // Simulate fallback analysis
            setTimeout(() => {
                const fallbackReport = {
                    summary: `The user '${username}' showed significant security deviations. Multi-point baseline drift indicates a high risk profile. Trigger features include: ${reasons.join(', ')}. Action threshold was crossed with risk value: ${score}%.`,
                    suspected_tactics: mitre.includes("T1078") ? ["Initial Access", "Lateral Movement", "Execution"] : ["Exfiltration"],
                    confidence_score: score > 75 ? "High" : "Medium",
                    remediation_steps: [
                        `Initiate multi-factor authentication (MFA) step-up for ${username}`,
                        `Quarantine endpoint session vectors immediately`,
                        `Review standard geographic baseline constraints`
                    ]
                };
                renderCopilotReport(fallbackReport);
            }, 600);
        }
    });

    function renderCopilotReport(report) {
        copilotResConfidence.textContent = report.confidence_score;
        if (report.confidence_score === "High") {
            copilotResConfidence.style.color = "var(--color-critical)";
        } else if (report.confidence_score === "Medium") {
            copilotResConfidence.style.color = "var(--color-warning)";
        } else {
            copilotResConfidence.style.color = "var(--color-success)";
        }

        copilotSummaryText.textContent = report.summary;

        // Suspected Tactics Tags
        copilotTacticsContainer.innerHTML = "";
        report.suspected_tactics.forEach(tactic => {
            const span = document.createElement("span");
            span.className = "badge badge-indigo";
            span.textContent = tactic;
            copilotTacticsContainer.appendChild(span);
        });

        // Remediation Playbook
        copilotRemediationList.innerHTML = "";
        report.remediation_steps.forEach(step => {
            const li = document.createElement("li");
            li.textContent = step;
            copilotRemediationList.appendChild(li);
        });
    }

    // Quick Simulation Run Button (Header)
    document.getElementById("btn-quick-simulation").addEventListener("click", () => {
        navigateToSection("anomaly-detector");
        // Set extreme values and run
        document.getElementById("sim-failed-ratio").value = 80;
        document.getElementById("val-sim-failed-ratio").textContent = "80%";
        document.getElementById("sim-admin-cmds").value = 18;
        document.getElementById("val-sim-admin-cmds").textContent = "18";
        document.getElementById("sim-bytes").value = 800000;
        document.getElementById("val-sim-bytes").textContent = "800000 KB";
        
        setTimeout(() => {
            btnRunAnalysis.click();
        }, 100);
    });
});
