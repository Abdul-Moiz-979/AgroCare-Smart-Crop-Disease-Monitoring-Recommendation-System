# AgroCare

AgroCare is a crop disease detection platform built with:

- Frontend: Next.js (App Router)
- Backend: FastAPI (Python)
- Database: PostgreSQL

## Multilingual Support (English + Urdu)

The project now includes a production-ready multilingual foundation with:

- Language switcher in the navbar (English/Urdu)
- Default language: English
- Persistent language preference (localStorage + cookie)
- RTL support for Urdu (`dir="rtl"`)
- Dynamic `lang` and `dir` applied to the root HTML element
- Translation files:
  - `locales/en.json`
  - `locales/ur.json`
- Optional SEO language path support via middleware (`/en/...`, `/ur/...`)

## Frontend i18n Architecture

- Provider: `contexts/I18nContext.js`
  - Uses `next-intl`
  - Exposes `useAppTranslations(namespace)`
  - Exposes locale controls via `useLocaleSettings()`
  - Handles browser-language auto-detect fallback to English
- Root wiring: `app/layout.js`
  - Wrapped with `I18nProvider`
- Language switcher UI: `components/Navbar.js`

## Backend Translation API

Endpoint:

- `POST /api/translate`

Request body:

```json
{
  "text": "Common Rust",
  "target_lang": "ur"
}
```

Response body:

```json
{
  "original_text": "Common Rust",
  "translated_text": "کامن رسٹ",
  "target_lang": "ur"
}
```

Implemented in:

- `backend/app/routers/translate.py`
- `backend/app/schemas.py`
- Registered in `backend/app/main.py`

Dependency added:

- `deep-translator`

## Dynamic Content Translation (Frontend + Backend)

For dynamic text (for example disease names and treatment text coming from backend), call:

- `translateDynamicText(text, targetLang)` from `useLocaleSettings()`

This helper internally calls `POST /api/translate`.

Example usage exists in:

- `app/results/page.js`

## RTL and Urdu Font

Global styles include:

- Urdu font import (`Noto Nastaliq Urdu`)
- `html[dir="rtl"]` direction handling
- `html[lang="ur"]` Urdu font activation

Configured in:

- `styles/globals.css`

## Setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Notes

- If any translation key is missing in Urdu, add it to `locales/ur.json`.
- If `/en/...` or `/ur/...` is opened, middleware stores the selected locale in a cookie and redirects to the clean route.
