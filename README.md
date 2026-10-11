# 🛡️ SSLGuard — Enterprise SSL/TLS Certificate Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF.svg?logo=githubactions&logoColor=white)]()
[![Docker](https://img.shields.io/badge/docker-compose%20ready-2496ED.svg?logo=docker&logoColor=white)]()
[![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203.2-blue.svg)]()
[![Java](https://img.shields.io/badge/java-17%2B-orange.svg)]()
[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%7C%20TypeScript-61dafb.svg)]()
[![Database](https://img.shields.io/badge/database-PostgreSQL%2018-336791.svg)]()
[![Styling](https://img.shields.io/badge/styling-Tailwind%20CSS%20v4-38bdf8.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()


> **SSLGuard** is a modern, enterprise-grade cybersecurity platform that prevents unexpected domain downtime by continuously evaluating X.509 certificate trust chains, analyzing TLS protocols and cipher suites, and automating proactive expiration defense.

---

## 🌟 Key Features

* **⚡ Low-Latency Direct TLS Handshake Engine**: Direct socket connections probe port 443 in `<200ms`, verifying leaf certificates, intermediate authorities, and root anchors against RFC 5280 standards.
* **🛡️ Security Grade Scoring (A+ to F)**: Automated cryptographic evaluation of protocol strengths (TLS 1.2 / TLS 1.3), cipher negotiation, and vulnerability detection (e.g., POODLE, deprecated protocols).
* **🔔 Multi-Tier Expiration Defense**: Automated background worker schedulers flag renewals across prioritized windows:
  * 🔴 **Critical Tier**: $\le 7$ days remaining
  * 🟡 **Warning Window**: $\le 30$ days remaining
  * 🟢 **Healthy / Compliant**: $> 30$ days remaining
  * ⚫ **Expired / Past Due**: Historical logs and alerts
* **🌐 Fleet Domain Inventory**: Centralized management dashboard with real-time health scores, manual re-verification triggers, and CSV report export.
* **🔐 Stateless JWT Authentication**: Spring Security 6 pipeline using HS512 signed JSON Web Tokens and BCrypt password encryption.
* **📊 Modern Enterprise UI/UX**: Built with React 19, Tailwind CSS v4, Framer Motion, and Recharts, featuring dark/light theme switching, accessible keyboard navigation (`:focus-visible`), and WCAG reduced-motion support.

---

## 🏗️ Architecture Overview

```mermaid
flowchart LR
    subgraph Client["Frontend Client (React 19 + TypeScript)"]
        UI["Landing Page / Dashboard"]
        Scanner["Interactive TLS Scanner"]
        Theme["Dark / Light Engine"]
    end

    subgraph Backend["Backend API (Spring Boot 3.2.5)"]
        Auth["Spring Security & JWT"]
        Engine["TLS Handshake & JSSE Engine"]
        Scheduler["@Scheduled Background Workers"]
        Docs["OpenAPI / Swagger UI"]
    end

    subgraph DB["Database"]
        Postgres[("PostgreSQL 18")]
    end

    UI -->|REST / JWT| Auth
    Scanner -->|POST /api/ssl/check| Engine
    Auth --> Engine
    Engine --> Scheduler
    Scheduler --> Postgres
```

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React 19, TypeScript, Vite 8
* **Styling & Design System:** Tailwind CSS v4, Glassmorphism, Semantic Tokens
* **Animations:** Framer Motion (GPU accelerated)
* **Data Fetching & State:** TanStack React Query v5, Zustand
* **Visualizations:** Recharts (Expiry Timeline, Security Grade Distribution)
* **Icons & Notifications:** Lucide React, React Hot Toast

### Backend
* **Language & Framework:** Java 17+ (Java 26 compatible), Spring Boot 3.2.5
* **Security:** Spring Security 6, JJWT (HS512), BCrypt
* **Data Persistence:** Spring Data JPA, Hibernate 6.4, HikariCP
* **Networking & Crypto:** Java JSSE, SSLSocket, X509Certificate, RFC 5280
* **API Documentation:** Springdoc OpenAPI 2.5 (Swagger UI)
* **Database:** PostgreSQL 18

---

---

## 🚀 Getting Started

### Option A: 🐳 One-Click Docker Compose (Fastest & Recommended)

Run the entire platform (PostgreSQL, Spring Boot backend, and React/Nginx frontend) with a single command:

```bash
# 1. Clone repository
git clone https://github.com/Akshay-27-jain/SSLGuard-SSL-TLS-Certificate-Intelligence-Platform.git
cd SSLGuard-SSL-TLS-Certificate-Intelligence-Platform

# 2. Configure environment (optional, defaults provided)
cp .env.example .env

# 3. Launch the container cluster
docker compose up -d --build
```

* **Frontend Web Application**: [http://localhost](http://localhost) (Port 80)
* **Backend API & Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **PostgreSQL Database**: `localhost:5432` (database: `sslchecker`)

To stop the containers:
```bash
docker compose down
```

---

### Option B: 💻 Local Manual Development Setup

#### Prerequisites
* **Java**: JDK 17 or higher (`java -version`)
* **Node.js**: v18 or higher (`node -v`)
* **PostgreSQL**: PostgreSQL 14+ running on port `5432` with a database named `sslchecker`
* **Maven**: 3.8+ (or use included wrapper)

#### 1. Database Setup

Create the PostgreSQL database:
```sql
CREATE DATABASE sslchecker;
```

#### 2. Environment Configuration

Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC connection URL | `jdbc:postgresql://localhost:5432/sslchecker` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | 256-bit+ secret key for HS512 JWT | *(Set in production)* |
| `SPRING_MAIL_USERNAME` | SMTP alert email address | `your-email@gmail.com` |
| `SPRING_MAIL_PASSWORD` | SMTP application password | `your-app-password` |

#### 3. Backend Setup

```bash
cd ssl-checker-backend
mvn clean test
mvn spring-boot:run
```
* Backend server starts on **`http://localhost:8080`**
* Interactive Swagger API documentation: **`http://localhost:8080/swagger-ui.html`**

#### 4. Frontend Setup

```bash
cd ssl-checker-frontend
npm install
npm run dev
```
* Frontend client starts on **`http://localhost:5173`**
* Production build & bundle splitting: `npm run build`
* Oxlint code verification: `npm run lint`

---

## 🔄 CI/CD Pipeline

The repository includes an enterprise-grade GitHub Actions CI/CD workflow (`.github/workflows/ci.yml`):
* **Backend Job**: Automatically sets up Eclipse Temurin JDK 17, executes isolated JUnit/Spring Boot integration tests with in-memory H2, and verifies Maven artifact packaging.
* **Frontend Job**: Sets up Node.js 20, runs `oxlint` lint checks, runs TypeScript compilation (`tsc -b`), and verifies production Vite bundle splitting.
* **Docker Validation**: Automatically checks Docker Compose schema validity on every push and pull request.


---

## 📡 Core API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ssl/check` | Live socket TLS handshake & chain audit | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/dashboard/stats` | Fleet health metrics & distribution | Yes (Bearer) |
| `GET` | `/api/domains` | Retrieve user monitored domains list | Yes (Bearer) |
| `POST` | `/api/domains` | Add domain with automated initial check | Yes (Bearer) |
| `POST` | `/api/domains/{id}/check` | Trigger on-demand manual verification | Yes (Bearer) |
| `DELETE` | `/api/domains/{id}` | Remove domain from monitoring | Yes (Bearer) |

---

## 🔒 Security & Privacy

* **Zero Hardcoded Secrets**: All sensitive values (passwords, JWT secrets, mail credentials) are dynamically configured via environment variables and excluded via `.gitignore`.
* **Stateless Tokens**: JWTs use HS512 cryptographic signatures with automatic expiration.
* **Socket Safety**: Handshake sockets utilize strict 10-second connection timeouts to protect against Slowloris-style denial-of-service hanging.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
