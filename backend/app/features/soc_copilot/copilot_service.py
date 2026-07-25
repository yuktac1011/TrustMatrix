# backend/app/features/soc_copilot/copilot_service.py

import json
from app.core.config import settings
from app.features.risk_engine.engine import RiskCorrelationEngine
from app.features.soc_copilot.schemas import (
    AlertExplanationRequest, 
    AlertExplanationResponse,
    IncidentInvestigationReport,
    NaturalLanguageQueryResponse
)

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class SOCCopilotService:
    """
    Connects system state context to Gemini LLM pipelines to explain complex threats.
    """

    @staticmethod
    def explain_alert(alert_context: AlertExplanationRequest) -> AlertExplanationResponse:
        """
        Explains single-alert anomalies.
        """
        prompt = f"""
        Analyze this security alert and respond ONLY with a valid JSON.
        - User: {alert_context.username}
        - Risk Score: {alert_context.anomaly_score}
        - Indicators: {", ".join(alert_context.flagged_reasons)}
        - Log Trace: {alert_context.raw_events_summary}

        Respond ONLY in this JSON format:
        {{
            "summary": "plain-english summary",
            "suspected_tactics": ["tactic1", "tactic2"],
            "confidence_score": "High/Medium/Low",
            "remediation_steps": ["step1", "step2"]
        }}
        """
        if GEMINI_AVAILABLE and settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
                return AlertExplanationResponse(**json.loads(response.text.strip()))
            except Exception:
                pass
        
        # Fallback to local static analysis helper
        return SOCCopilotService._generate_static_analysis(alert_context)

    # --- Feature 1: AI Incident Investigator ---
    @staticmethod
    def investigate_incident(incident_id: str) -> IncidentInvestigationReport:
        """
        Analyzes a correlated timeline incident and generates a security brief.
        """
        # Retrieve the target incident from our in-memory database
        incident = RiskCorrelationEngine._incidents.get(incident_id)
        if not incident:
            raise ValueError(f"Incident ID '{incident_id}' not found in correlation engine.")

        # Structure alert metrics for LLM analysis
        alerts_context = []
        for a in incident.alerts:
            alerts_context.append(
                f"- [{a.timestamp.isoformat()}] Anomaly Score: {a.anomaly_score} | "
                f"Indicator: {a.primary_contributor} | Details: {a.event_summary}"
            )
        alerts_summary = "\n".join(alerts_context)

        prompt = f"""
        You are a principal security investigator. Analyze the correlated security incident timeline below and respond ONLY with a valid JSON conforming to the schema.

        INCIDENT SUMMARY:
        - Incident ID: {incident.incident_id}
        - Target Account: {incident.username}
        - Aggregated Incident Risk Score: {incident.global_risk_score} / 100
        - Chronological Alert Sequence:
        {alerts_summary}

        Respond ONLY with a valid JSON document conforming to this exact structure:
        {{
            "incident_id": "{incident_id}",
            "executive_summary": "High-level summary of the threat narrative (e.g. compromised credential staging lateral moves)",
            "incident_timeline_analysis": ["Chronological trace of events and their security impact"],
            "mitre_attack_mapping": ["Mapped techniques and matching tactics"],
            "containment_recommendations": ["Actionable containment steps"]
        }}
        """

        if GEMINI_AVAILABLE and settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
                return IncidentInvestigationReport(**json.loads(response.text.strip()))
            except Exception:
                pass

        # Local fallback analysis helper
        return SOCCopilotService._generate_static_investigation(incident)

    # --- Feature 2: Natural Language Query Engine ---
    @staticmethod
    def query_system_state(query: str) -> NaturalLanguageQueryResponse:
        """
        Answers natural language questions by analyzing current system states.
        """
        # Gather live context from our in-memory database
        all_incidents = RiskCorrelationEngine.list_all_incidents()
        
        active_threats_context = []
        for inc in all_incidents:
            if not inc.is_mitigated:
                active_threats_context.append(
                    f"User: '{inc.username}' has an active incident (Risk: {inc.global_risk_score}/100) "
                    f"containing {len(inc.alerts)} alerts. Primary trigger: {inc.alerts[0].event_summary if inc.alerts else 'N/A'}"
                )
        
        system_context = "\n".join(active_threats_context) if active_threats_context else "No active alerts in the system."

        prompt = f"""
        You are an interactive AI SOC Analyst assistant. Answer the user's natural language question based on the current system states below.

        CURRENT SYSTEM SECURITY CONTEXT:
        {system_context}

        USER QUESTION:
        "{query}"

        Respond ONLY with a valid JSON document conforming to this structure:
        {{
            "query": "{query}",
            "answer": "A natural, helpful response answering the question based on the provided context.",
            "referenced_entities": ["List of usernames, workstations, or assets mentioned in your answer"]
        }}
        """

        if GEMINI_AVAILABLE and settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
                return NaturalLanguageQueryResponse(**json.loads(response.text.strip()))
            except Exception:
                pass

        # Static parsing fallback helper
        return SOCCopilotService._parse_query_statically(query, all_incidents)

    # --- Fallback Helper Methods ---
    @staticmethod
    def _generate_static_analysis(alert_context: AlertExplanationRequest) -> AlertExplanationResponse:
        return AlertExplanationResponse(
            summary=f"User {alert_context.username} was flagged due to {', '.join(alert_context.flagged_reasons)}.",
            suspected_tactics=["Exfiltration"],
            confidence_score="Medium",
            remediation_steps=["Reset credentials", "Audit file system logs"]
        )

    @staticmethod
    def _generate_static_investigation(incident) -> IncidentInvestigationReport:
        return IncidentInvestigationReport(
            incident_id=incident.incident_id,
            executive_summary=f"Incident for {incident.username} indicates anomalous activity with a global risk score of {incident.global_risk_score}/100.",
            incident_timeline_analysis=[
                f"Alert 1: {a.event_summary} (Score: {a.anomaly_score})" for a in incident.alerts
            ],
            mitre_attack_mapping=["Credential Access", "Exfiltration"],
            containment_recommendations=[
                f"Isolate host assets connected to {incident.username}.",
                "Enforce MFA step-up authentication challenges."
            ]
        )

    @staticmethod
    def _parse_query_statically(query: str, incidents) -> NaturalLanguageQueryResponse:
        query_lower = query.lower()
        referenced = []
        answer = "I searched our records but found no active security events matching your query."

        # Handle 'Alice' queries
        if "alice" in query_lower:
            referenced.append("alice")
            alice_inc = next((i for i in incidents if i.username == "alice"), None)
            if alice_inc:
                answer = (
                    f"Alice is flagged as High Risk ({alice_inc.global_risk_score}/100) "
                    f"due to {len(alice_inc.alerts)} correlated events, including: "
                    f"'{alice_inc.alerts[0].event_summary if alice_inc.alerts else 'N/A'}'."
                )
            else:
                answer = "Alice has no active incidents or elevated risk scores in our database."

        # Handle 'file transfer' queries
        elif "file" in query_lower or "transfer" in query_lower or "download" in query_lower:
            transfer_incidents = [
                i for i in incidents 
                if any("bytes" in str(a.primary_contributor).lower() or "download" in str(a.event_summary).lower() for a in i.alerts)
            ]
            if transfer_incidents:
                users = [i.username for i in transfer_incidents]
                referenced.extend(users)
                answer = f"Suspicious transfer events were detected for: {', '.join(users)}."
            else:
                answer = "No anomalous file transfer activities have been recorded."

        return NaturalLanguageQueryResponse(
            query=query,
            answer=answer,
            referenced_entities=referenced
        )