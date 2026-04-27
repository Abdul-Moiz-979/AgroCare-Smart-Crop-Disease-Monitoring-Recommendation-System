"""
AgroCare Backend — Translation Router
POST /api/translate  → translate text content between supported languages
"""

from fastapi import APIRouter, HTTPException
from deep_translator import GoogleTranslator

from app.schemas import TranslateRequest, TranslateResponse

router = APIRouter(prefix="/api", tags=["Translation"])

SUPPORTED_LANGS = {"en", "ur"}


@router.post("/translate", response_model=TranslateResponse)
def translate_text(payload: TranslateRequest):
    text = (payload.text or "").strip()
    target_lang = (payload.target_lang or "en").lower()

    if not text:
        return TranslateResponse(
            original_text=text,
            translated_text=text,
            target_lang=target_lang,
        )

    if target_lang not in SUPPORTED_LANGS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported target language: {target_lang}",
        )

    if target_lang == "en":
        return TranslateResponse(
            original_text=text,
            translated_text=text,
            target_lang=target_lang,
        )

    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return TranslateResponse(
            original_text=text,
            translated_text=translated,
            target_lang=target_lang,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Translation failed: {exc}")
