# CollegeCompass — Comprehensive Project Documentation & Technical Report

---

## 1. Executive Summary

**CollegeCompass** is a full-stack, data-driven college discovery, comparison, and admission prediction platform designed specifically for higher education aspirants in India. Unlike conventional aggregator portals that rely on sponsored placements and opaque lead-generation forms, CollegeCompass delivers **unbiased, transparent, structured admission intelligence** — including verified fee brackets, multi-year placement metrics (median and highest CTC), entrance exam cutoffs (JEE Main, MHT-CET, KCET, COMEDK, etc.), and deterministic admission probability scoring.

---

## 2. Problem Statement & Solution

### 2.1 The Problem
1. **Opaque & Sponsored Rankings**: Existing college search portals in India prioritize colleges that pay for featured listings rather than merit or student outcomes.
2. **Scattered Admission Data**: Cutoffs, fee structures, and placement statistics are fragmented across hundred-page PDF brochures and unofficial forum threads.
3. **Black-Box Predictors**: Existing prediction tools require phone numbers for aggressive marketing calls while offering zero algorithmic transparency.
4. **Lack of Side-by-Side Evaluation**: Comparing two or three competing colleges requires manual cross-tabulation across multiple browser tabs.

### 2.2 The Solution
CollegeCompass addresses these challenges through:
- **Clean SaaS Interface**: Minimalist, high-contrast, professional typography (Times New Roman serif design system) inspired by modern productivity tools.
- **Explainable Admission Predictor**: Weighted mathematical algorithm (Rank Cutoff 40%, Stream Match 25%, Location 15%, Fees 10%, Rating 10%) with transparent scoring breakdowns.
- **Side-by-Side Comparison Matrix**: Real-time evaluation of up to 3 colleges with automatic best-metric badges.
- **Authenticated Student Accounts**: NextAuth.js (Auth.js) session management allowing users to bookmark target institutions and submit verified community reviews.

---

## 3. Complete Technology Stack

| Layer | Technology | Version | Purpose / Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | `15.2.1` | Server-Side Rendering (SSR), Static Site Generation (SSG), React Server Components (RSC). |
| **Core UI Library** | **React** | `19.0.0` | Component-driven declarative user interface. |
| **Styling & Design System** | **Tailwind CSS v4** | `4.0.0` | Utility-first styling with `@theme` variables, zero runtime CSS overhead. |
| **Typography** | **Times New Roman** | System Serif | Editorial, academic, high-contrast typography avoiding generic AI aesthetics. |
| **Icons & Visuals** | **Lucide React** & Custom SVG | `0.475.0` | Lightweight vector icons and custom SVG branding emblem. |
| **Backend Runtime** | **Node.js (Next.js Route Handlers)**| `v20+` | RESTful API endpoints running on Vercel Edge / Serverless functions. |
| **Database** | **PostgreSQL (Docker / Neon)** | `v16` | Relational ACID database for structured academic and cutoff data. |
| **ORM & Data Modeling** | **Prisma ORM** | `6.4.1` | Type-safe database client, schema migrations, and relational queries. |
| **Authentication** | **NextAuth.js (v5 Beta)** | `5.0.0-beta.25`| Secure credentials-based authentication with bcrypt-hashed passwords. |
| **Password Security** | **bcryptjs** | `3.0.2` | Salted SHA-512 password hashing with 10 salt rounds. |
| **Language & Tooling** | **TypeScript** & **ESLint** | `5.x` | Strict compile-time type checking and automated linting. |

---

## 4. System Architecture

```
[ Web Browser Client ]
         |
         v
[ Next.js 15 App Router & React Server Components ]
         |
         +----> [ Frontend Views: Home, Colleges, Compare, Predictor, Detail, Auth ]
         |
         +----> [ Next.js Route Handlers: /api/colleges, /api/predict, /api/compare ]
                     |
                     v
             [ Prisma ORM Client ]
                     |
                     v
             [ PostgreSQL Database ]
```

---

## 5. Database Schema & Relational Models

The database schema is managed through `prisma/schema.prisma` with 6 relational models:

1. **User**: Stores authenticated student accounts (`id`, `name`, `email`, `password` via bcrypt, `role` as `USER` or `ADMIN`).
2. **College**: Central entity with institutional metadata (`name`, `slug`, `city`, `state`, `type`, `feesMin`, `feesMax`, `avgPackage`, `highestPackage`, `placementRate`, `rating`).
3. **Course**: Specific academic programs (`degree`, `stream`, `duration`, `annualFees`, `seats`).
4. **Cutoff**: Historical closing ranks partitioned by `exam` (e.g. JEE Main, MHT-CET, KCET), `course`, `category` (General, OBC, SC, ST, EWS), and `year`.
5. **Review**: Student reviews linked to both `User` and `College` with star rating (1–5), title, and feedback comments.
6. **SavedCollege**: Bookmark bridge table with a compound unique index on `[userId, collegeId]`.

---

## 6. Functional Modules & Implementation Details

### 6.1 Institutional Directory & Multi-Facet Filtering
- **Dynamic URL Synchronization**: Search queries, selected states, disciplines, fee caps, and ratings serialize directly to URL search parameters (`/colleges?stream=Engineering&state=Maharashtra&maxFees=400000`), enabling shareable links and browser history navigation.
- **Server-Side Debouncing**: Search input queries are debounced at 350ms to prevent excessive database calls.
- **Multi-Parameter Filtering**: Supports combination queries across 4 dimensions simultaneously with instantaneous client-side UI updates.

### 6.2 Side-by-Side Comparison Matrix
- **3-Way Evaluation**: Allows students to select up to 3 colleges from any page or directly inside the comparison table.
- **Persistent Floating Tray (`CompareBar`)**: A bottom-docked tray tracks selections across page navigations via React Context (`CompareContext`).
- **Automated Metric Highlighting**: The comparison algorithm automatically identifies and highlights the lowest fees, highest average package, top placement rate, and best accreditation score among selected institutions.

### 6.3 Explainable Admission Predictor Algorithm
The core prediction engine (`/api/predict`) evaluates candidate ranks against historical cutoff distributions:

$$\text{Match Score} = (S_{\text{rank}} \times 0.40) + (S_{\text{course}} \times 0.25) + (S_{\text{location}} \times 0.15) + (S_{\text{fees}} \times 0.10) + (S_{\text{rating}} \times 0.10)$$

Where:
- **Rank Score ($S_{\text{rank}}$)**:
  - If $\text{Candidate Rank} \le \text{Closing Rank}$: $S_{\text{rank}} = 100 - (\frac{\text{Candidate Rank}}{\text{Closing Rank}} \times 20)$ (80–100%)
  - If $\text{Candidate Rank} > \text{Closing Rank}$ but within $1.25\times$: $S_{\text{rank}} = 60 - (\frac{\text{Candidate Rank} - \text{Closing Rank}}{\text{Closing Rank} \times 0.25} \times 30)$ (30–60%)
  - If $\text{Candidate Rank} > 1.25\times \text{Closing Rank}$: $S_{\text{rank}} = 15\%$
- **Course Match ($S_{\text{course}}$)**: 100% if exact match, 50% for related stream, 0% otherwise.
- **Location Preference ($S_{\text{location}}$)**: 100% if in candidate's target state, 70% for national scope.
- **Budget Compatibility ($S_{\text{fees}}$)**: 100% if within budget, proportionally scaled down if higher.
- **Quality Score ($S_{\text{rating}}$)**: Scaled from institutional rating ($\text{Rating} / 5.0 \times 100$).

Predictions are classified into:
1. **High Probability Match ($\ge 85\%$)**: Candidate rank is safely below closing rank.
2. **Competitive Match ($70\% - 84\%$)**: Candidate rank is close to closing rank cutoff.
3. **Aspirational Match ($< 70\%$)**: Candidate rank exceeds cutoff; requires spot round variance.

### 6.4 Authentication & User Personalization
- **NextAuth.js Integration**: Secure session handling using encrypted JWT tokens.
- **Bookmark Syncing**: Asynchronous optimistic UI updates when shortlisting colleges, saved to PostgreSQL `SavedCollege` table.
- **Review Submission & Aggregation**: Logged-in students can write reviews with live recalculation of college average ratings.

---

## 7. RESTful API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/colleges` | Paginated college list with search, filter, and sort params | No |
| `GET` | `/api/colleges/filters` | Aggregated lists of states, streams, types, and fee bounds | No |
| `GET` | `/api/colleges/[id]` | Full institutional details, courses, cutoffs, and reviews | No |
| `GET` | `/api/compare?ids=id1,id2,id3` | Detailed comparison dataset for 2–3 colleges | No |
| `POST` | `/api/predict` | Computes admission probability scores based on rank & params | No |
| `POST` | `/api/auth/signup` | Creates a new student user account with bcrypt password | No |
| `POST` | `/api/auth/[...nextauth]` | Handles session login, verification, and logout | No |
| `GET` | `/api/saved-colleges` | Fetches all bookmarked colleges for the authenticated user | Yes |
| `POST` | `/api/saved-colleges` | Adds a college to user's saved shortlist | Yes |
| `DELETE`| `/api/saved-colleges/[id]` | Removes a college from saved shortlist | Yes |
| `POST` | `/api/colleges/[id]/reviews`| Submits a verified student review and updates college score | Yes |

---

## 8. Presentation & Viva Q&A Guide

### Q1: Why did you choose Next.js 15 App Router instead of a traditional React SPA?
> **Answer**: Next.js App Router provides Server-Side Rendering (SSR) and Static Site Generation (SSG). For an educational directory, fast initial page loads and search engine visibility (SEO) are critical. Server Components also allow querying PostgreSQL directly during page generation, eliminating client-side API waterfall delays.

### Q2: How does your Admission Predictor work under the hood?
> **Answer**: It is a deterministic multi-criteria scoring algorithm. It queries historical entrance exam cutoffs (e.g., JEE Main General/OBC/SC/ST closing ranks) and applies weighted factors: 40% rank margin, 25% course availability, 15% location preference, 10% annual fee affordability, and 10% institutional rating. Every factor is explainable with zero black-box scoring.

### Q3: How is student password data secured?
> **Answer**: Passwords are never stored in plaintext. We use `bcryptjs` with 10 salt rounds to hash passwords before insertion into PostgreSQL. Authentication is handled via NextAuth.js JWT tokens with HTTP-only cookies to prevent XSS and CSRF vulnerabilities.

### Q4: How is database performance optimized for filtering across hundreds of colleges?
> **Answer**: Prisma ORM executes targeted SQL queries with indexed database columns on `slug`, `type`, `state`, and compound unique constraints on `[userId, collegeId]` and `[collegeId, exam, course, category, year]`. We also leverage Next.js route revalidation caching (`revalidate = 3600`) for top pages.

---

## 9. Local Setup & Execution Instructions

```bash
# 1. Clone the repository and navigate to directory
cd college-compass

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collegecompass?schema=public"
# NEXTAUTH_SECRET="your-super-secret-jwt-key"
# NEXTAUTH_URL="http://localhost:3000"

# 4. Run Prisma database migrations
npx prisma migrate dev

# 5. Seed database with sample colleges, courses, and cutoffs
npx prisma db seed

# 6. Start development server
npm run dev
# Open http://localhost:3000 in your browser
```

---

*Report generated for academic/internship project presentation. Built with Next.js 15, Prisma ORM, PostgreSQL, and Tailwind CSS.*
