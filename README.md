# E-Commerce Platform - DevOps Architecture

A full-stack e-commerce application with integrated DevOps tooling for containerization, CI/CD, and observability.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GitHub Actions                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────┐  │
│  │ backend-ci  │───▶│ frontend-ci │───▶│ docker-build → Push to GHCR    │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Docker Compose Stack                               │
│                                                                              │
│   ┌──────────────────────── ecommerce-network ─────────────────────────┐    │
│   │                                                                     │    │
│   │  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐        │    │
│   │  │  PostgreSQL │◀────▶│   Backend   │◀────▶│  Frontend   │        │    │
│   │  │   :5432     │      │   :8080     │      │   :5173     │        │    │
│   │  └─────────────┘      └──────┬──────┘      └─────────────┘        │    │
│   │                              │                                     │    │
│   │                    /actuator/prometheus                            │    │
│   │                              │                                     │    │
│   │  ┌───────────────────────────┼───────────────────────────────┐    │    │
│   │  │           OBSERVABILITY STACK                              │    │    │
│   │  │                           │                                │    │    │
│   │  │  ┌─────────────┐    ┌─────▼─────┐    ┌─────────────┐      │    │    │
│   │  │  │   Grafana   │◀───│Prometheus │    │    Loki     │      │    │    │
│   │  │  │   :3000     │    │   :9090   │    │   :3100     │      │    │    │
│   │  │  └──────┬──────┘    └───────────┘    └──────▲──────┘      │    │    │
│   │  │         │                                    │             │    │    │
│   │  │         └────────────────────────────────────┤             │    │    │
│   │  │                                              │             │    │    │
│   │  │                                    ┌─────────┴───┐         │    │    │
│   │  │                                    │  Promtail   │         │    │    │
│   │  │                                    │ (log agent) │         │    │    │
│   │  │                                    └─────────────┘         │    │    │
│   │  └────────────────────────────────────────────────────────────┘    │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🐳 Docker Services

### Application Services

| Service      | Image                  | Port | Description                              |
| ------------ | ---------------------- | ---- | ---------------------------------------- |
| **postgres** | `postgres:16-alpine`   | 5432 | PostgreSQL database with health checks   |
| **backend**  | Custom (Spring Boot)   | 8080 | Java 21 REST API with Actuator endpoints |
| **frontend** | Custom (React + Nginx) | 5173 | Vite-built React app served via Nginx    |

### Monitoring Services

| Service        | Image                     | Port | Description                           |
| -------------- | ------------------------- | ---- | ------------------------------------- |
| **prometheus** | `prom/prometheus:latest`  | 9090 | Metrics collection and storage        |
| **grafana**    | `grafana/grafana:latest`  | 3000 | Metrics/logs visualization dashboards |
| **loki**       | `grafana/loki:latest`     | 3100 | Log aggregation backend               |
| **promtail**   | `grafana/promtail:latest` | -    | Log collection agent                  |

---

## 🔄 Service Communication Flow

### 1. Application Flow

```
User → Frontend (Nginx:80) → Backend (Spring Boot:8080) → PostgreSQL:5432
```

### 2. Metrics Flow

```
Backend (/actuator/prometheus) ← Prometheus (scrape every 15s) → Grafana (visualize)
```

### 3. Logging Flow

```
All Containers → Docker Socket → Promtail → Loki → Grafana (query & visualize)
```

---

## 🚀 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push/PR to `main` or `dev`:

```
┌──────────────────────────────────────────────────────────────┐
│                      TRIGGER: Push/PR                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌─────────────────────┐    ┌─────────────────────┐         │
│   │    backend-ci       │    │    frontend-ci      │         │
│   │                     │    │                     │         │
│   │  • Setup JDK 21     │    │  • Setup Node 20    │         │
│   │  • Start PostgreSQL │    │  • npm ci           │         │
│   │  • mvnw install     │    │  • npm run build    │         │
│   └──────────┬──────────┘    └──────────┬──────────┘         │
│              │                           │                    │
│              └───────────┬───────────────┘                    │
│                          ▼                                    │
│   ┌─────────────────────────────────────────────────────┐    │
│   │              docker-build (main branch only)         │    │
│   │                                                      │    │
│   │  • Login to GitHub Container Registry (GHCR)        │    │
│   │  • Build & push backend image                        │    │
│   │  • Build & push frontend image                       │    │
│   │  • Tags: latest + commit SHA                         │    │
│   └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Observability Stack

### Prometheus

- **Config**: `prometheus.yml`
- **Scrapes**: Backend metrics from `/actuator/prometheus`
- **Interval**: Every 15 seconds

### Grafana

- **URL**: http://localhost:3000
- **Credentials**: admin / admin
- **Pre-configured datasources**:
  - Prometheus (default) → for metrics
  - Loki → for logs

### Loki + Promtail

- **Promtail** reads logs from all Docker containers via the Docker socket
- **Loki** stores and indexes logs for querying in Grafana

---

## 🛠️ Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Environment Setup

Before running the application, you need to configure environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set required values:
# - POSTGRES_PASSWORD (required)
# - JWT_SECRET_KEY (required) - generate with: openssl rand -base64 64
# - CLOUDINARY_* (optional, for image uploads)
```

### Run Locally

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce

# Set up environment variables (see above)
cp .env.example .env
# Edit .env with your values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Access Points

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Grafana     | http://localhost:3000 |
| Prometheus  | http://localhost:9090 |

---

## 📁 Project Structure

```
ecommerce/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions pipeline
├── backend/
│   ├── Dockerfile                 # Multi-stage Spring Boot build
│   └── src/                       # Java source code
├── frontend/
│   ├── Dockerfile                 # Multi-stage React + Nginx build
│   ├── nginx.conf                 # Nginx configuration
│   └── src/                       # React source code
├── grafana/
│   └── provisioning/
│       └── datasources/
│           └── datasource.yml     # Pre-configured Prometheus & Loki
├── .env.example                   # Environment variables template
├── docker-compose.yml             # Full stack orchestration
├── prometheus.yml                 # Prometheus scrape configuration
├── promtail-config.yml            # Promtail log collection config
└── README.md                      # This file
```

---

## 🔐 Security Features

- **Environment-based secrets**: All sensitive values (JWT keys, DB passwords, API keys) are configured via environment variables
- **Non-root containers**: Both backend and frontend run as `appuser`
- **Health checks**: All critical services have health checks
- **Multi-stage builds**: Smaller, more secure production images
- **Alpine-based images**: Minimal attack surface
- **Input validation**: All API endpoints validate input data
- **CORS configuration**: Configurable allowed origins for production
- **Pinned image versions**: Monitoring stack uses specific versions for reproducibility

---

## 📈 Monitoring Dashboards

Once running, access Grafana at http://localhost:3000 and:

1. **Explore Metrics**: Use the Prometheus datasource to query JVM metrics, HTTP request rates, etc.
2. **Explore Logs**: Use the Loki datasource to search container logs with queries like:
   ```
   {container="ecommerce-backend"} |= "error"
   ```

---

## 🧹 Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes (database data, Grafana settings)
docker-compose down -v
```
