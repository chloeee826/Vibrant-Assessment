# Vibrant LMS — Assessment Starter

Clean scaffold with **no solutions**. Use this to complete the assessment in **ASSESSMENT.md**.

## What’s here
- `web/` — React + TypeScript + Vite + TanStack Query + Tailwind (blank components & hooks)
- `api/` — Node/Express + Knex (sqlite3 dev-ready) with route stubs returning **501 Not Implemented**

## Run
### API
```bash
cd api
npm i
npm start
```
- Starts on **http://localhost:4000**
- You will implement DB wiring, auth, and endpoints per ASSESSMENT.md.

### Web
```bash
cd web
npm i
npm run dev
```
- Starts on **http://localhost:5173**
- Proxies `/api` → `http://localhost:4000`
- UI shows TODO sections and placeholder components.

## Contributing your answers
- Implement directly in this repo; keep commits small and descriptive.
- Update the README with any decisions or deviations.

## AI Assistance

In this project, AI tools were used to improve development efficiency and speed up implementation in several areas:

- **Mock Data Generation**  
  AI was used to create realistic sample data for testing APIs and UI components.
- **Code Suggestions**  
  Leveraged AI to assist with code ideas, improve validation logic, and handle error cases more efficiently.
- **Documentation Support**  
  Used AI to draft parts of the API documentation and clarify implementation details.

**Note:** The assessment requires using **Ant Design Table and Form** for the inventory table and sample form. The web project already includes `antd`.
