# backend/app/features/nlp_topic_engine/router.py

from fastapi import APIRouter, HTTPException
from app.features.nlp_topic_engine.schemas import TopicAnalysisRequest, TopicAnomalyResult
from app.features.nlp_topic_engine.analyzer import lda_analyzer

router = APIRouter(prefix="/nlp", tags=["NLP Topic Anomaly Engine"])


@router.post(
    "/analyze-topics",
    response_model=TopicAnomalyResult,
    summary="Analyze document topics for behavioral anomalies",
    description=(
        "Trains a Latent Dirichlet Allocation (LDA) model on a corpus of 'normal' documents "
        "(file names, email subjects, log messages) and scores the user's recent documents. "
        "Documents whose dominant topic does not appear in the normal baseline are flagged as anomalous. "
        "This detects semantic shifts like a Finance user suddenly accessing security exploit files."
    )
)
async def analyze_document_topics(request: TopicAnalysisRequest) -> TopicAnomalyResult:
    """
    Runs LDA topic modeling to detect semantic anomalies in user document access patterns.

    Example use-case:
    - Finance user normally accesses: payroll.xlsx, budget_q4.csv, invoice_2026.pdf
    - Suddenly accesses: kernel_exploit.py, mimikatz.exe, shadow_copy_delete.sh
    - The system flags a high anomaly ratio due to completely new topic space.
    """
    try:
        result = lda_analyzer.analyze(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LDA topic analysis failed: {str(e)}"
        )


@router.post(
    "/quick-scan",
    response_model=TopicAnomalyResult,
    summary="Quick topic scan — no corpus required",
    description=(
        "Performs a quick self-referential topic scan. The provided documents act as both "
        "corpus and test set, clustering themselves into topics. Useful for identifying "
        "how semantically diverse a user's recent activity is."
    )
)
async def quick_topic_scan(username: str, documents: list[str], n_topics: int = 5) -> TopicAnomalyResult:
    """
    Quick self-referential scan — documents serve as their own corpus.
    Useful to quickly inspect topic diversity of a user's recent file access log.
    """
    if not documents:
        raise HTTPException(status_code=422, detail="At least 1 document is required.")

    request = TopicAnalysisRequest(
        username=username,
        target_documents=documents,
        corpus_documents=None,  # Self-referential
        n_topics=n_topics
    )
    try:
        return lda_analyzer.analyze(request)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quick topic scan failed: {str(e)}"
        )
