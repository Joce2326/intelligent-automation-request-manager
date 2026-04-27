# Intelligent Automation Request Manager

React + TypeScript prototype for managing automation requests with AI workflow recommendations.

---

## Screenshots

### Dashboard Overview

![Dashboard](screenshots/FullPage1.png)

### AI Recommendation Analysis

![AI Recommendation](screenshots/AIRecommendation.png)

### Analyze Requests

![Analyze Requests](screenshots/AnalyzeRequests.png)

### Application Overview

![Overview](screenshots/FullPage2.png)

---

## Overview

This project simulates an intelligent automation intake application where business users can submit automation requests and receive AI-assisted workflow recommendations.

Features include:

- Automation request dashboard
- AI request analysis
- Request prioritization
- Suggested workflow recommendations
- Approval-oriented process mapping
- Request details drawer
- Status tracking

---

## Features

### Request Management

Capture requests including:

- Department
- Request Type
- Description
- Expected Benefit
- Priority
- Request Status

---

### AI Recommendation Engine (Prototype)

Generates:

- AI Summary
- Suggested Category
- Suggested Priority
- Recommended Next Step
- Flow Suggestion

---

### Dynamic Workflow Suggestions

Example Approval Flow

Trigger  
↓  
Manager Approval  
↓  
Conditional Outcome  
↓  
Update Status

---

## Tech Stack

- React
- TypeScript
- Vite
- Fluent UI
- Node.js
- GitHub Models API (prototype integration approach)

---

## Run Locally

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Project Structure

```text
src/
 ├── components/
 ├── services/
 ├── models/
 └── App.tsx

screenshots/
```

---

## Future Enhancements

Planned:

- GitHub Models / OpenAI integration
- Power Automate flow generation
- Dataverse integration
- PCF control reuse
- Workflow export as JSON
- Approval simulation engine

---

## Author

Jocelyn Zavala Fara

Microsoft 365 | SharePoint | Power Platform | SPFx | Dataverse
