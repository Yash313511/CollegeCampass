# 🧭 CollegeCompass — Project Presentation & Technical Documentation

> **India's Data-Driven College Discovery, Comparison & Admission Prediction Platform**  
> *Discover • Compare • Decide*

---

## 🎯 1. Project Overview & Pitch

### 💡 The Problem
- **Sponsored Aggregator Rankings**: Existing higher-ed portals in India prioritize colleges paying for leads rather than educational outcomes.
- **Fragmented Admission Metrics**: Fee structures, placement metrics (median vs highest CTC), and cutoffs are locked in hundreds of disparate PDFs.
- **Black-Box Admission Tools**: Existing predictors demand phone numbers for aggressive marketing calls with zero algorithmic transparency.

### ✨ The Solution
**CollegeCompass** is a high-contrast, structured SaaS platform delivering:
1. **Curated Institutional Discovery**: Multi-faceted filtering across 76+ indexed colleges by State, Stream, Fees, and Ownership Type.
2. **Side-by-Side Comparison Matrix**: Real-time evaluation of 2–3 colleges with automatic best-metric badges.
3. **Deterministic Admission Predictor**: Mathematical, explainable prediction engine based on historical exam cutoffs (JEE Main, MHT-CET, KCET, COMEDK, etc.).
4. **Student Accounts & Verified Reviews**: Secure user authentication, saved shortlist trays, and community review ratings.

---

## 🏗️ 2. Technology Stack & Architecture

```mermaid
graph TD
    Client["Client Browser (Desktop & Mobile)"] --> NextRouter["Next.js 15 App Router (SSR & RSC)"]
    
    subgraph UI_Layer ["Frontend / Presentation Layer"]
        NextRouter --> Views["React 19 Views (Home, Directory, Compare, Predictor)"]
        Views --> Styling["Tailwind CSS v4 + Times New Roman Design System"]
    end
    
    subgraph API_Layer ["Backend / API Route Handlers"]
        NextRouter --> APIRoutes["Next.js Edge & Serverless Route Handlers"]
        APIRoutes --> ZodValidation["Zod Input Validation & Error Handling"]
    end
    
    subgraph Data_Layer ["Persistence & Security Layer"]
        APIRoutes --> PrismaClient["Prisma ORM (v6.4.1)"]
        PrismaClient --> PostgresDB[("PostgreSQL Database (Neon / Docker)")]
        APIRoutes --> AuthModule["NextAuth.js v5 + bcryptjs Password Hashing"]
    end
```

### 🛠️ Technology Choices Breakdown

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Server Components, Hybrid Static/Server Rendering, zero-waterfall performance. |
| **UI Library** | **React 19** | Component-driven state, optimistic UI updates, and Context API. |
| **Styling** | **Tailwind CSS v4** | Lightweight `@theme` utility tokens, zero CSS-in-JS runtime penalty. |
| **Typography** | **Times New Roman** | High-contrast, clean academic serif aesthetic. |
| **Database** | **PostgreSQL 16** | Relational ACID store with strict foreign keys and multi-column indexes. |
| **ORM** | **Prisma ORM** | Type-safe migrations, auto-generated TypeScript schema client. |
| **Authentication**| **NextAuth.js (v5 Beta)** | Encrypted JWT cookies, credentials provider with `bcryptjs` 10 salt rounds. |

---

## 🗄️ 3. Database Entity-Relationship (ER) Schema

```mermaid
erDiagram
    User ||--o{ SavedCollege : bookmarks
    User ||--o{ Review : authors
    College ||--o{ Course : offers
    College ||--o{ CutoffData : requires
    College ||--o{ Review : receives
    College ||--o{ SavedCollege : saved_in

    User {
        string id PK
        string email UK
        string name
        string password
        Role role
    }

    College {
        string id PK
        string name
        string slug UK
        string city
        string state
        CollegeType type
        float rating
        int reviewCount
        int feesMin
        int feesMax
        float avgPackage
        float highestPackage
        float placementRate
    }

    Course {
        string id PK
        string collegeId FK
        string degree
        string stream
        int annualFees
        int duration
        int seats
    }

    CutoffData {
        string id PK
        string collegeId FK
        string exam
        string course
        string category
        int year
        int closingRank
    }

    Review {
        string id PK
        string collegeId FK
        string userId FK
        int rating
        string title
        string comment
    }

    SavedCollege {
        string id PK
        string userId FK
        string collegeId FK
    }
```

---

## 🚀 4. Key Functional Modules & Live Features

### 🔍 Module 1: Institutional Discovery & Filters (`/colleges`)
- **Real-Time URL State Synchronization**: Search, filters, sort, and pagination are serialized to URL query strings for instant link sharing.
- **Multi-Parameter Filtering**: Filter by Discipline, State, Ownership (Govt/Private/Deemed), Max Annual Fees, and Star Rating.
- **Debounced Full-Text Search**: 350ms input debouncer preventing unnecessary database load.

### ⚖️ Module 2: Side-by-Side Comparison Matrix (`/compare`)
- **3-Institution Matrix**: Compare 2 to 3 colleges side-by-side across fees, average package, highest package, placement rate, and accreditation.
- **Smart Metric Highlighting**: Algorithm automatically highlights the winning value in each category (e.g. lowest tuition fees, highest package).
- **Persistent Bottom Tray (`CompareBar`)**: Docked drawer allowing students to bookmark and carry selections across multiple views.

### 🔮 Module 3: Explainable Admission Predictor (`/predictor`)
- **Deterministic Multi-Criteria Algorithm**: Evaluates candidate ranks against historical entrance exam cutoff distributions.
- **Explainable Scoring Breakdown**: Shows exact match percentages ($0\% - 100\%$) and categorized match tiers (*High Probability*, *Competitive*, *Aspirational*).

### 🔐 Module 4: Authentication & Community Reviews (`/auth`, `/colleges/[slug]`)
- **Credentials Auth**: Encrypted session cookies with email/password authentication.
- **Shortlist Database**: Save/bookmark colleges with instant optimistic UI feedback.
- **Verified Review Engine**: Authenticated students submit reviews with live dynamic recalculation of college average ratings.

---

## 🧮 5. Predictor Scoring Mathematical Model

$$\text{Match Score} = (S_{\text{rank}} \times 0.40) + (S_{\text{course}} \times 0.25) + (S_{\text{location}} \times 0.15) + (S_{\text{fees}} \times 0.10) + (S_{\text{rating}} \times 0.10)$$

| Factor | Weight | Evaluation Logic |
| :--- | :--- | :--- |
| **Rank Score ($S_{\text{rank}}$)** | **40%** | $\text{Rank} \le \text{Cutoff} \implies 100 - (\frac{\text{Rank}}{\text{Cutoff}} \times 20)$<br>$\text{Rank} \le 1.25 \times \text{Cutoff} \implies 60 - (\frac{\text{Rank} - \text{Cutoff}}{0.25 \times \text{Cutoff}} \times 30)$ |
| **Course Score ($S_{\text{course}}$)** | **25%** | $100\%$ on exact program match; $50\%$ on related discipline stream; $0\%$ otherwise. |
| **Location Score ($S_{\text{location}}$)**| **15%** | $100\%$ if within user's preferred state; $70\%$ if national scope selected. |
| **Fees Score ($S_{\text{fees}}$)** | **10%** | $100\%$ if within budget; scaled down if exceeding declared fee ceiling. |
| **Rating Score ($S_{\text{rating}}$)** | **10%** | Scaled proportionally: $(\text{Rating} / 5.0) \times 100$. |

---

## 📡 6. RESTful API Architecture

| Method | Endpoint | Purpose | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/colleges` | Paginated directory query with search & filter params | Public |
| `GET` | `/api/colleges/filters` | Aggregated filter bounds (states, streams, fees) | Public |
| `GET` | `/api/colleges/[id]` | Full institutional profile with courses and reviews | Public |
| `GET` | `/api/compare?ids=...` | Comparison payload for selected institutions | Public |
| `POST` | `/api/predict` | Computes admission probability ranking | Public |
| `POST` | `/api/auth/signup` | Student registration with bcrypt hashing | Public |
| `POST` | `/api/auth/[...nextauth]` | Session login, token issuance, and logout | Public |
| `GET` | `/api/saved-colleges` | User's shortlisted colleges list | Authenticated |
| `POST` | `/api/saved-colleges` | Adds a college to user shortlist | Authenticated |
| `DELETE`| `/api/saved-colleges/[id]`| Removes a college from shortlist | Authenticated |
| `POST` | `/api/colleges/[id]/reviews`| Submits a verified student review | Authenticated |

---

## ⚡ 7. Local Setup & Quick Start

```bash
# 1. Clone the project repository
git clone <repo-url>
cd college-compass

# 2. Install dependencies
npm install

# 3. Configure local environment variables (.env)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collegecompass?schema=public"
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# 4. Run Prisma database migrations
npx prisma migrate dev

# 5. Seed initial data (76 colleges, 448 courses, 880 cutoffs)
npx prisma db seed

# 6. Start the development server
npm run dev
```

### 👤 Demo Credentials
- **Email**: `demo@collegecompass.in`
- **Password**: `demo1234`

---

## 🛡️ 8. Quality & Verification Metrics

- **ESLint & TypeScript**: Zero warnings, zero errors (`npm run lint`).
- **Production Build**: 100% routes compiled successfully (`npm run build`).
- **Security**: Salted SHA-512 password encryption via `bcryptjs`, HTTP-only session cookies.

---

*Built with Next.js 15, Prisma ORM, PostgreSQL, and Tailwind CSS.*
