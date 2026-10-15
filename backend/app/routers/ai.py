from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas import (
    AIParsedAnnouncementRequest,
    AIParsedImageRequest,
    AIParseResult,
    AIStatusResponse,
    AIChatRequest,
    AIChatResponse,
)
from ..services.ai_service import AIExtractorService
from ..auth import (
    get_current_demo_user,
    DemoAccountInfo,
    security,
    verify_demo_token,
    DEMO_ACCOUNTS,
)
from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter(prefix="/api/ai", tags=["AI Event Importer"])

def get_optional_demo_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[DemoAccountInfo]:
    if not credentials or not credentials.credentials:
        return None
    try:
        payload = verify_demo_token(credentials.credentials)
        user_id = payload.get("sub")
        email = payload.get("email")
        for account in DEMO_ACCOUNTS.values():
            if account.id == user_id or account.email == email:
                return account
        return None
    except Exception:
        return None

@router.get("/status", response_model=AIStatusResponse)
def get_ai_status():
    """
    Returns current AI extraction status, active provider, and supported inputs.
    """
    return AIExtractorService.get_status()

@router.post("/parse-event", response_model=AIParseResult)
async def parse_announcement_text(
    req: AIParsedAnnouncementRequest,
    current_user: DemoAccountInfo = Depends(get_current_demo_user),
):
    """
    Parses raw event announcement text into structured event fields using
    configured AI Provider (Gemini / OpenAI) or rule-based fallback.
    """
    try:
        return await AIExtractorService.parse_announcement(req.announcement_text)
    except ValueError as e:
        err_str = str(e)
        if "503" in err_str or "unavailable" in err_str.lower() or "overloaded" in err_str.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Google Gemini is temporarily overloaded or unavailable. Please retry in a moment. ({err_str})"
            )
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=err_str
        )
    except Exception as e:
        err_str = str(e)
        if "503" in err_str or "unavailable" in err_str.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Google Gemini service temporarily unavailable. Please retry. ({err_str})"
            )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI Provider extraction failed: {err_str}"
        )

@router.post("/parse-image", response_model=AIParseResult)
async def parse_flyer_image(
    req: AIParsedImageRequest,
    current_user: DemoAccountInfo = Depends(get_current_demo_user),
):
    """
    Parses campus event poster or flyer image into structured event fields
    using configured Vision AI model or image metadata analysis.
    """
    try:
        return await AIExtractorService.parse_flyer_image(req.image_url, req.image_name or "flyer.png")
    except ValueError as e:
        err_str = str(e)
        if "503" in err_str or "unavailable" in err_str.lower() or "overloaded" in err_str.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Google Gemini Vision is temporarily overloaded or unavailable. Please retry in a moment. ({err_str})"
            )
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=err_str
        )
    except Exception as e:
        err_str = str(e)
        if "503" in err_str or "unavailable" in err_str.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Google Gemini Vision service temporarily unavailable. Please retry. ({err_str})"
            )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI Vision extraction failed: {err_str}"
        )

@router.post("/assistant-chat", response_model=AIChatResponse)
async def chat_with_assistant(
    req: AIChatRequest,
    current_user: Optional[DemoAccountInfo] = Depends(get_optional_demo_user),
):
    """
    Converses with MyCampus AI Assistant powered by Google Gemini.
    Strictly answers campus and website related queries.
    """
    try:
        context = req.context or {}
        if current_user:
            context["current_user"] = {
                "name": current_user.name,
                "role": current_user.role,
                "department": current_user.department,
                "student_id": current_user.student_id,
            }
        return await AIExtractorService.chat_assistant(req.messages, context)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assistant chat error: {str(e)}"
        )
