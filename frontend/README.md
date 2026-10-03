# DiaCare Senior — Frontend Web Application

Elderly-friendly, voice-first progressive web application (PWA) built with **React 19**, **Vite**, and **Tailwind CSS v4**.

## Key Frontend Architecture
- **Voice Recognition:** In-browser Web Speech API supporting English, Hindi, and Marathi with Devanagari numeral extraction.
- **Accessibility:** WCAG 2.2 AAA standards, 56px minimum touch targets, persistent A/A+/A++ font scaling.
- **Offline-First PWA:** Workbox service worker caching and IndexedDB (`idb`) background queue for offline blood sugar and medicine logging.
- **Data Visualizations:** Responsive clinical charts built with Recharts featuring doctor-approved Time-in-Range (TIR) target bands.
- **1-Page Doctor Summary:** Optimized print-ready CSS (`@media print`) for clinical consultations.

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```
