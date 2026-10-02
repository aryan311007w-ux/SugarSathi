# DiaCare Senior — Backend Services

RESTful API backend and deterministic clinical risk engine built with **Node.js**, **Express**, and **MongoDB**.

## Core Modules & Services
- **Deterministic Risk Engine (`services/riskEngine.js`):** Rule-based risk assessment adhering to ADA/RSSDI geriatric diabetes targets without generative AI in the critical safety loop.
- **Medication Scheduler (`jobs/reminderCron.js`):** Multi-stage escalation engine (Scheduled ➔ Snooze ➔ WhatsApp family alert).
- **Meta WhatsApp Cloud Integration (`services/whatsappService.js`):** Dispatcher with automatic fallback to local Mock Mode for demonstrations.
- **AI Health Companion (`services/aiService.js`):** Grounded diabetes Q&A companion using Google Gemini with clinical guardrails.
- **Authentication:** Multi-role JWT authentication supporting senior numeric PINs, caregiver accounts, and clinician access.

## Development

```bash
# Install dependencies
npm install

# Seed synthetic test profiles
npm run seed

# Run server
npm start
```
