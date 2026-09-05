# Rawat Properties Website

A responsive static website for Rawat Properties, Vasundhara, Ghaziabad.

## Files

- `index.html` — website structure/content
- `style.css` — responsive styling and layout
- `script.js` — mobile menu, property search UI, form validation and frontend interactions
- `assets/` — place for local images/assets

## Run locally

Open `index.html` in a browser.

For a local server in VS Code, use Live Server or run:

```bash
python -m http.server 5500
```

Then open:

http://localhost:5500

## Lead form integration

The lead form is currently frontend-only. To receive real leads, connect the submit handler in `script.js` to:

- an n8n webhook
- Google Sheets through your own backend/workflow
- Formspree
- a CRM endpoint
- your preferred database/API

Do not put private API keys directly inside `script.js`.

## Images

The current design uses remote Unsplash images so the site works immediately. For production, replace them with licensed/local Rawat Properties photos and store them inside `assets/`.

## Important

The supplied business information has been used without adding invented claims, property listings, awards, or experience statistics.
