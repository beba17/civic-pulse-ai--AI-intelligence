# Civics Plus

### From Citizen Voice to Actionable Civic Insights

**Civics Plus** is an AI-powered civic intelligence prototype that transforms unstructured community signals into structured, explainable civic insights and recommendation workflows.

It combines a modern React interface with **Google Gemini 2.5 Flash** to help organize civic concerns, surface recurring patterns, provide contextual guidance, and support human-reviewed civic workflows.

> **Hackathon Project · Community / Cooperation Track**

[Live Demo](https://civics-plus.ai.studio/) · [GitHub Repository](https://github.com/beba17/civic-pulse-ai--AI-intelligence)

---

## The Problem

Civic issues are often reported through fragmented channels such as conversations, forms, messages, and community reports.

This creates several challenges:

* Important citizen signals can become difficult to organize.
* Recurring local issues may be buried inside large volumes of raw information.
* Civic teams need structured context before deciding what requires attention.
* Citizens often need clearer guidance about civic concerns and next steps.
* Moving from **citizen feedback → useful insight → actionable workflow** can be slow and fragmented.

The challenge is not simply collecting more feedback.

**The challenge is turning citizen voice into usable civic intelligence.**

---

## Our Solution

Civics Plus provides an AI-assisted workflow for converting civic signals into structured insights.

```text
Citizen Voice
      ↓
Signal Intake
      ↓
AI-Assisted Analysis
      ↓
Civic Insights
      ↓
Recommendations
      ↓
Human Review
      ↓
Action
```

The system is designed around a **human-in-the-loop principle**.

AI assists with organizing information, synthesizing context, and generating guidance. It does not replace official human authority or independently execute civic decisions.

---

## What Civics Plus Does

### 🗺️ Civic Signal Dashboard

Provides a centralized view of civic signals and key information so recurring community concerns can be easier to understand.

### 📍 Civic Hotspots

Groups recurring signals by issue and location to make potential patterns easier to identify.

### 📝 Citizen Intake

Provides a structured interface for submitting civic concerns and supporting information.

### 🔎 Evidence Filtering

Allows signals to be explored using relevant attributes such as urgency, neighborhood, and department.

### 🤝 Human Review Workflow

Recommendations can move through a review-oriented workflow rather than being treated as automatically approved decisions.

### 💬 Ask Civics Plus

A Gemini-powered conversational assistant that provides contextual civic guidance in a concise and explainable format.

---

# AI Architecture

Civics Plus uses **Google Gemini 2.5 Flash** through the `@google/genai` SDK.

The AI layer is designed to:

* Interpret civic questions and context.
* Structure relevant information.
* Generate concise civic guidance.
* Support recommendation drafting.
* Maintain an objective and transparent response style.
* Encourage human verification before official action.

### Runtime Flow

```text
┌──────────────────────┐
│       Citizen        │
│  Reports a Concern   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   React + Vite UI    │
│  Intake / Dashboard  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Civic Signals &    │
│      Evidence        │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Gemini 2.5 Flash     │
│ AI Civic Assistance  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Insights & Guidance  │
│ Recommendations      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Human Review      │
└──────────────────────┘
```

If Gemini is unavailable, the application includes a deterministic local civic-knowledge fallback for basic guidance.

---

# Technology Stack

| Layer                    | Technology              |
| ------------------------ | ----------------------- |
| Frontend                 | React                   |
| Language                 | TypeScript              |
| Build Tool               | Vite                    |
| Styling                  | Tailwind CSS            |
| Icons                    | Lucide React            |
| AI                       | Google Gemini 2.5 Flash |
| AI SDK                   | `@google/genai`         |
| Deployment Configuration | Netlify-compatible      |

---

# Project Structure

```text
civics-plus/
│
├── src/
│   ├── components/
│   │   └── CivicMapDashboard.tsx
│   │
│   ├── lib/
│   │   └── gemini.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
│
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── netlify.toml
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Getting Started

## Prerequisites

* Node.js 22.12+ recommended
* npm

## 1. Clone the repository

```bash
git clone https://github.com/beba17/civic-pulse-ai--AI-intelligence.git
cd civic-pulse-ai--AI-intelligence
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

> **Security note:** `VITE_*` variables are exposed to the browser bundle. This setup is suitable for the current prototype. A production deployment should route Gemini requests through a secure backend so the API key is never exposed to clients.

## 4. Start the development server

```bash
npm run dev
```

The Vite development server runs on the configured local development port.

## 5. Build for production

```bash
npm run build
```

## 6. Preview the production build

```bash
npm run preview
```

---

# Environment Variables

| Variable              | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `VITE_GEMINI_API_KEY` | Gemini API key used by the current AI-assisted prototype |

Never commit real API keys or secrets to the repository.

---

# Deployment

The repository includes a minimal `netlify.toml` configuration for building the Vite application.

Production build:

```bash
npm run build
```

Output directory:

```text
dist/
```

The current deployment model is intentionally lightweight and compatible with the existing frontend architecture.

For a production civic deployment, the AI layer should be moved behind a secure server-side API.

---

# Responsible AI

Civic technology requires a strong distinction between **AI assistance** and **official civic authority**.

Civics Plus therefore follows several principles:

### Human-in-the-Loop

AI-generated recommendations are intended to support human review rather than automatically execute official decisions.

### Transparency

AI-generated guidance should be distinguishable from verified government records and official decisions.

### Prototype Scope

The current application uses seeded/demo civic signals rather than a live municipal database.

### Secure AI Architecture

The current client-side Gemini configuration is appropriate for a prototype but should be replaced by a server-side AI gateway for production.

### Verified Data

A production version should connect to authenticated and verified civic/open-data sources before being used for real-world decision workflows.

---

# Current Limitations

Civics Plus is currently a **working prototype**, not a production municipal platform.

Current limitations include:

* Civic signals are demo/seeded data.
* The application does not represent a live municipal database.
* AI responses should be independently verified before being used for real-world decisions.
* The current `VITE_GEMINI_API_KEY` architecture exposes the key to the browser bundle.
* Production deployment would require stronger authentication, authorization, privacy controls, monitoring, rate limiting, and auditability.

These limitations are intentional parts of the prototype-to-production roadmap.

---

# Future Roadmap

## 01 — Verified Civic Data

Integrate authenticated municipal and public open-data sources.

## 02 — Secure AI Gateway

Move Gemini requests to a backend service with secure key management and rate limiting.

## 03 — Real-Time Signal Ingestion

Connect the platform to verified civic reporting channels and structured data feeds.

## 04 — Auditability

Introduce activity logs, recommendation history, access controls, and traceable review workflows.

## 05 — Multilingual Civic Assistance

Expand citizen-facing guidance across multiple languages.

## 06 — Advanced Civic Analytics

Introduce stronger trend detection and longitudinal analysis once reliable real-world data sources are available.

---

# Hackathon Relevance

Civics Plus explores how AI can support **community participation, civic information processing, and collaborative decision workflows**.

The core idea is simple:

> **Make citizen voice easier to structure, understand, review, and turn into actionable civic insight.**

Rather than positioning AI as an autonomous decision-maker, Civics Plus uses AI as an assistance layer between community signals and human civic workflows.

---

# Why This Matters

A large amount of civic information already exists in the form of citizen observations, complaints, questions, and community feedback.

The opportunity is to make that information:

**Structured → Understandable → Contextual → Reviewable → Actionable**

Civics Plus is a prototype exploring that workflow.

---

# Demo

🚀 **Live Demo:**
https://civics-plus.ai.studio/

💻 **Source Code:**
https://github.com/beba17/civic-pulse-ai--AI-intelligence

---

# Documentation

For the technical system design, see:

**[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

# Project Status

**Status:** Hackathon Prototype

**Focus:** AI-assisted civic intelligence and community workflows

**AI Model:** Google Gemini 2.5 Flash

**Frontend:** React + TypeScript + Vite

---

## Built for Civic Innovation

### Civics Plus

**From Citizen Voice to Actionable Civic Insights.**

> AI should help people understand complex civic information better — while meaningful decisions remain accountable to humans.

