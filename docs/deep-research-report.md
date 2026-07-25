# Paper 1: Kim et al. 2019 (MDPI Applied Sciences)

**Full citation:** Kim *et al.*, *“Insider Threat Detection Based on User Behavior Modeling and Anomaly Detection Algorithms.”* Applied Sciences 9(19):4018 (2019). [DOI:10.3390/app9194018](https://doi.org/10.3390/app9194018).

**Summary:** This paper builds an unsupervised “insider threat” detection framework using the **CERT R6.2** dataset (4,000 users, 5 malicious insiders).  User logs are preprocessed into **three datasets** (Figure 3): 

- **Daily Activity Summary:** 60 candidate features (e.g. logins by hour, file operations, USB events, network visits, email counts) aggregated per **(user, day)**.  After filtering, ~1.39 million daily instances (user-days) were obtained, with only 73 anomalies.  They even built **role-specific models** (Salesman, IT Admin, Electrical Engineer) because anomalies concentrate in certain roles.  

- **Email Content Topics:** Each email’s text is turned into a 50‑dimensional topic-vector via **LDA** (topics=50, α=1).  The intuition: anomalous emails have unusual topic mixes.

- **Email Communication Network:** Weekly directed graph of email exchanges.  Nodes are users (personal or “@dtaa.com” accounts), edges weighted by email counts.  They compute 28 network features per user (in/out-degree, Jaccard similarity of neighbor sets across weeks, betweenness centrality, etc.).  The four known malicious users are highly anomalous in this network.

For **anomaly detection**, they train **one-class models** on each dataset separately (no labeled anomalies used in training): 

- Gaussian density estimation (parametric),
- Parzen (kernel density) estimation,
- PCA (autoencoder-like reconstruction errors),
- K‑Means distances (with K=3,5,10 clusters).

They also tried *ensembling* by averaging the **ranked** anomaly scores of models (inverse average rank).

**Evaluation:**  Because insiders are rare, they measure “true detection rate” as the fraction of real anomalies captured in the top X% of anomaly scores.  For daily summaries and email topics, they split 90% of normal data for training and test on the remaining 10% + all anomalies. For the email network (very few samples), they train on *all* normal instances and score both normal+anomalous.  They repeat each experiment 30 times and report average detection at several thresholds (1%,5%,10%,15%,20%,25%,30%).  

**Key Results:** 

- **Daily Activity Model:** Best ensembles (Parzen+PCA, etc.) detect ~50% of anomalies in the *top 1%* scores for “Electrical Engineer” role.  By the *top 15%* of scores, they catch >90% of anomalies for two of the roles.  Detection for “Salesman” improves when threshold is raised (94.8% at 30% cutoff).

- **Email Topics:** Parzen+PCA yields 37.6% detection at top 1% for IT Admins, rising to ~99% by top 30%. Other roles see similar trends (two-thirds of anomalies found by top 30%).  

- **Email Network:** For 3 of 4 malicious users, *all* malicious emails are in the top 25% of scores for that user.  E.g. *CDE1846* is 100% detected at top-5% and *HIS1706* at top-10%. (One user, CMP2946, remains hard to detect.) Combining models did not improve over the best single model for this tiny test set.

Overall, the framework **works reasonably well on this imbalanced synthetic data**, catching most threats if analysts monitor the highest-scoring anomalies. The authors note it’s a purely batch, data-driven system and suggest future work on real-time streams and expert integration.

**Concrete Techniques:**  Key implementable details:

- **Feature Engineering (Daily Summaries):** From CERT logs, create one record per user-per-day. Features could include **login counts by hour** (or day vs night), **count of PC logoffs**, **file writes/reads**, **download/upload volume**, **USB insertion/removal counts**, **HTTP visits**, **email sent/received** counts, etc. (They referenced ~60 possible features and then filtered down via a Gaussian test.)  For an MVP, one can start with a small set (e.g. total logins, total files opened, total bytes transferred, after-hours access flag).

- **Feature Engineering (Email Topics):** Use an LDA model (e.g. `sklearn.decomposition.LatentDirichletAllocation`) on all email bodies to get a topic distribution per email (they used 50 topics). Alternatively, skip or use TF-IDF on subjects if text processing is heavy.

- **Feature Engineering (Email Graph):** Weekly bins: build a directed graph where each edge weight = number of emails from user A to B that week. Compute for each user features like *in-degree, out-degree, self-loop count, betweenness centrality*, and *Jaccard similarity between this week’s neighbor set and last week’s*. Tools: NetworkX.

- **Preprocessing:** Normalize/scale features (they didn’t detail it, but scaling helps PCA/KMeans). Also label “day vs night” (their features like `numLogonDay` vs `numLogonNight`).

- **Modeling:** For a quick MVP, use **Isolation Forest** (`sklearn.ensemble.IsolationForest`) on the daily-summary features. For email topics, one-class SVM or another Isolation Forest could work. The original used density/PCA/KMeans; an Isolation Forest is simpler to code.  If time allows, add a simple **autoencoder** (e.g. a small PyTorch/Paddle model) trained on normal data, using reconstruction error as anomaly score.

- **Anomaly Scoring:** Compute anomaly scores (higher = more anomalous). Then rank users (or user-days) by score. The paper essentially used percentile thresholds as “alerts”.

- **Role- or Peer-Based Models:** They found anomalies mainly in 3 roles. In practice, you could train separate models per role or peer-group to improve sensitivity (see Paper 3 discussion). A hackathon MVP could skip this, but even grouping by department or job-level helps reduce false positives.

- **Ensembling:** They averaged rank over models. A simple hackathon version: compute anomaly scores from two methods (IF + autoencoder) and average or multiply scores.

- **Thresholds:** The cutoffs (1%,5%,…30%) are design choices. In a dashboard, you might highlight the top N (e.g. top 1% of anomalies) for analysts to inspect first.

- **Risk/Alert Dashboard:** Although this paper only outputs scores, you can extend by labeling top anomalies as incidents. For demo, show the ranking and example anomalies. 

**Strengths & Weaknesses:**

- *Strengths:* Uses real insider-simulated dataset (CERT). Integrates multiple behavior types (PC usage, email, network). Focuses on anomaly detection (no need for labeled attacks). Demonstrates good detection rates on sparse anomalies.

- *Weaknesses:* Purely **batch** (per day/week) models – no streaming. Doesn’t correlate events into incidents (each anomaly is isolated). High-dimensional features (60+) may overfit. No explicit mechanism to reduce false alarms beyond role grouping. No explanations beyond “score”. Scalability concerns: CERT is big (1.4M instances) but still manageable; real enterprise logs are bigger. 

- *Assumptions:* “Normal” user behavior can be learned solely from past data (no online learning). Attacks produce statistical outliers. Behavior is role-dependent (they even restricted modeling to roles with >10 anomalies). 

**Adapting for a 48h MVP vs Production:**

- **MVP (48h):** 
  - *Data:* Use CERT R6.2 or synthetic logs. Focus on *daily summaries* only (skip LDA and email graph unless easily available).
  - *Features:* Start with 5–10 key features: e.g. logins, downloads (MB), files accessed, after-hours flag, new device flag, volume uploaded, USB events.   Provide Python code to aggregate logs (using `pandas`) by user-date to compute counts.
  - *Model:* Train an IsolationForest on the historical normal data. Use e.g. `IsolationForest(n_estimators=100, contamination=0.01)`.
  - *Scoring:* For each new user-day event, compute `score = -clf.score_samples(feature_vector)` (or similar).  
  - *Threshold:* e.g. mark top-1% scores as alerts.
  - *Dashboard:* Show a **threat feed** list (user, risk score). Add a “Behavioral DNA” panel: a small bar chart showing how many σ deviations each feature is (if time).
  - *Code snippet (pseudo-Python):*
    ```python
    # Feature extraction (example)
    df = load_logs(...)  # columns: user, ts, event_type, value
    df['date'] = df.ts.dt.date
    daily = df.groupby(['user','date']).agg({
        'login': 'sum',    # number of logins
        'download_bytes': 'sum',
        'file_access': 'count',
        'after_hour': 'sum', 
        # ... 
    }).fillna(0)
    
    # Train Isolation Forest on historical data (exclude known attacks or use only normal)
    X_train = daily.values
    iso = IsolationForest(random_state=0)
    iso.fit(X_train)
    
    # Anomaly scoring on test data
    scores = -iso.score_samples(X_train)  # higher = more anomalous
    daily['anomaly_score'] = scores
    top_alerts = daily.nlargest(n=10, columns='anomaly_score')
    ```
  
- **Production-Level:**
  - Include the full pipeline: **real-time ingestion** of logs (via Kafka or streaming).
  - Maintain **per-user baselines** (mean/variance of each feature) and compute z-scores on the fly.
  - Implement **peer baselines** (see Paper 3) – compute each user’s feature vs. distribution of same-role peers, and include peer-deviation features.
  - Add the **email LDA module** and graph features. Use scalable LDA (sklearn or Gensim) and networkX/PyGraph for graph features.
  - Use a combination of detectors: IF + autoencoder. Possibly a lightweight neural network (1-2 layers) since we have labeled (attack) data in CERT to tune.
  - Build an **Alert Correlation Engine**: group multiple anomalies by user & time into incidents (Paper 1 mentions they did separate, but we can extend).
  - Risk scoring: combine anomaly magnitudes, peer-deviation, number of events, etc.  
  - Explainability: use SHAP on features (see Paper 7) to show why a user is flagged.
  - Scaling: partition models by role or stream to handle thousands of users.

- **Pseudocode for key components (MVP style):**

    ```python
    # Compute z-score per user vs their own history
    user_stats = daily.groupby('user').agg(['mean','std'])
    # After processing, for a given user-day:
    X = daily.loc[(user, date)]   # vector of today's features
    zscores = (X - user_stats['mean']) / user_stats['std']
    user_deviation = np.max(np.abs(zscores))  # max sigma deviation
    
    # Isolation Forest scoring
    iso_score = -iso.predict_proba(X.reshape(1,-1))[0]
    
    # Combined risk (simple example): 
    risk = 0.5 * (iso_score_norm) + 0.3 * (user_deviation_norm) + 0.2 * (some_peer_deviation_norm)
    ```
  - For peer deviation, compute similar z-score of X vs. distribution of that user’s peer group (mean/std of peers).

**Unique ideas to integrate:**

- **Behavioral DNA / Baseline:** Visualize each user’s feature percentiles (e.g. “Login pattern: 80% of peers”, “Download volume: 95th percentile”) – extends the z-score idea.
- **Attack Graph Mapping:** Though this paper didn’t do it, use its idea of timeline (login → email → network anomaly) to build a React Flow graph linking correlated events.
- **Multi-Signal Correlation:** Instead of three separate alerts, combine daily+email anomalies into **one incident** if close in time for same user.
- **Counterfactuals:** E.g. show how removing one behavior (no after-hours login) would drop the risk.

**Validation Experiments:** Using CERT R6.2:

1. **Baseline Detection:** Train IF on 90% of normal daily data, test on 10%+anomalies. Compute TDR at top-1%..30% and compare to random baseline.
2. **Feature Ablation:** Remove one feature group (e.g. exclude HTTP or USB) to see impact on TDR.
3. **Model Comparison:** IsolationForest vs One-Class SVM vs simple PCA anomaly.
4. **Peer vs Personal:** Try personal-only vs peer-only vs combined deviation scoring, see which catches more anomalies with fewer false alerts.
5. **Time-window effects:** Test sliding window (5-day user history) vs per-day model, see latency.
6. **Synthetic Data:** Generate simulated slow exfiltration (small data every day) and test if our score gradually rises.

**Reproducibility:** The CERT dataset (v6.2) is publicly available from SEI. No official code repo for the paper. We’ll implement in Python (scikit-learn). For LDA, use [sklearn](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.LatentDirichletAllocation.html). No pretrained models needed.

**Next Steps:** To integrate:
- **Feature pipeline:** Parse CERT logs → create daily summary table (3–4 hours).
- **Isolation Forest model:** Code training & scoring (1–2 hours).
- **Peer baseline:** Compute per-role stats and implement deviation (2 hours).
- **Anomaly ranking & dashboard:** Expose top-N in API (2 hours).
- **Quick tests:** Compute detection rates on known anomalies (2 hours).
- **MVP demo:** Hardcode a scenario (e.g. user deviates gradually) and show risk increase.

