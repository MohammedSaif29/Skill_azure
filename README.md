# ☁️ Azure Storage Tier Analyzer

A web tool that recommends the right **Azure Blob Storage performance tier (Standard vs Premium)** for a given workload, backed by **real benchmark data** collected from an Azure Storage account.

Enter your workload characteristics — request rate, read/write mix, latency needs, access frequency and cost sensitivity — and the app scores both tiers, recommends one, and explains why.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-Azure_SDK-3776AB?logo=python&logoColor=white)
![Azure](https://img.shields.io/badge/Microsoft_Azure-Blob_Storage-0078D4?logo=microsoftazure&logoColor=white)

---

## ✨ Features

- **Workload analysis form** — request rate, read/write percentages, latency requirement, access frequency, workload type and cost sensitivity
- **Rule-based recommendation engine** — weighted scoring for Standard vs Premium, with a human-readable list of reasons
- **Score comparison chart** showing how each tier scored
- **Real Azure benchmarks** — a Python script downloads 1 MB, 10 MB and 100 MB test blobs from Azure using the Azure Storage SDK and records download time and throughput
- **Benchmark dashboard** — throughput vs file size and download time vs file size charts with a performance summary

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Recharts, Lucide icons |
| Backend | Node.js, Express 5, REST API |
| Benchmarking | Python, `azure-storage-blob` SDK, CSV results |
| Cloud | Microsoft Azure Blob Storage |

## 🏗️ How It Works

```
React UI ──POST /api/recommend──► Express API ──► recommendation engine (scoring rules)
    │
    └────GET /api/benchmark──────► Express API ──► benchmark_results.csv
                                                        ▲
                                    benchmark.py ───────┘  (runs against Azure Blob Storage)
```

## 🔌 API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/recommend` | Returns `{ recommendation, standardScore, premiumScore, reasons }` |
| `GET` | `/api/benchmark` | Returns benchmark results (file size, download time, throughput) |
| `GET` | `/api/health` | Health check |

## 🚀 Run Locally

```bash
# Backend
cd backend
npm install
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Re-run the Azure benchmark (optional):**
```bash
pip install azure-storage-blob python-dotenv
# .env → AZURE_STORAGE_CONNECTION_STRING=...  AZURE_CONTAINER_NAME=...
python benchmark.py
```

## 👤 Author

**Mohammed Saif** — B.Tech CSE
[LinkedIn](https://www.linkedin.com/in/saif-mohammed-939902335/) · [GitHub](https://github.com/MohammedSaif29)
