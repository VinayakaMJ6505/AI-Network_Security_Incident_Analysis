# 🔄 Process Flow & Data Flow Diagrams (DFD) Manual
## AI-Powered Network Security Incident Analysis System

> **Document Version**: 2.0.0  
> **Target Audience**: Systems Analysts, SOC Engineers, Software Architects, Academic Reviewers  
> **Status**: Production / Complete  
> **Applicable Standards**: Gane & Sarson / Yourdon & DeMarco DFD Standards, UML 2.5 Sequence Specifications

---

## 📑 Table of Contents
1. [Introduction & Diagramming Methodology](#1-introduction--diagramming-methodology)
2. [DFD Level 0: Context Diagram](#2-dfd-level-0-context-diagram)
3. [DFD Level 1: Subsystem Data Flow Diagram](#3-dfd-level-1-subsystem-data-flow-diagram)
4. [DFD Level 2: Detailed Process Decompositions](#4-dfd-level-2-detailed-process-decompositions)
   - [4.1 Process 2.0: NLP Entity Extraction & Keyword Matching](#41-process-20-nlp-entity-extraction--keyword-matching)
   - [4.2 Process 3.0 & 4.0: Feature Preprocessing & XGBoost Classification](#42-process-30--40-feature-preprocessing--xgboost-classification)
   - [4.3 Process 5.0: Dynamic CVSS-Aligned Risk Assessment](#43-process-50-dynamic-cvss-aligned-risk-assessment)
   - [4.4 Process 6.0: Generative AI Root-Cause & Playbook Generation](#44-process-60-generative-ai-root-cause--playbook-generation)
5. [End-to-End System Process Flows & Sequence Diagrams](#5-end-to-end-system-process-flows--sequence-diagrams)
   - [5.1 Sequence Diagram: Real-Time Live Network Telemetry Analysis](#51-sequence-diagram-real-time-live-network-telemetry-analysis)
   - [5.2 Sequence Diagram: Batch Syslog Upload & Ingestion Pipeline](#52-sequence-diagram-batch-syslog-upload--ingestion-pipeline)
   - [5.3 Sequence Diagram: On-Demand Incident Investigation & AI Playbook](#53-sequence-diagram-on-demand-incident-investigation--ai-playbook)
   - [5.4 Sequence Diagram: Executive Dashboard Aggregation & DEFCON Alerting](#54-sequence-diagram-executive-dashboard-aggregation--defcon-alerting)
6. [Data Dictionary & Data Flow Matrix](#6-data-dictionary--data-flow-matrix)

---

## 1. Introduction & Diagramming Methodology

This document details the **Data Flow Diagrams (DFDs)** and **System Process Flows** for the AI-Powered Network Security Incident Analysis System.

### Diagram Notational Conventions
In accordance with standard Gane & Sarson / Yourdon methodologies:
- **External Entities (Squares/Rectangles)**: External actors, network hardware, or third-party cloud services that produce or consume data (e.g., *SOC Analyst*, *Network Packet Feeder*, *Groq Cloud LLM*).
- **Processes (Rounded Boxes / Circles)**: Transformations, calculations, or algorithms applied to inbound data (e.g., *XGBoost Inference*, *Risk Scoring*).
- **Data Stores (Parallel Lines / Cylinders)**: Passive repositories of information (e.g., *MongoDB Incidents*, *Local JSON Cache*, *Pretrained Model Weights*).
- **Data Flows (Arrows)**: Named vectors showing the directional movement of structured information between entities, processes, and stores.

---

## 2. DFD Level 0: Context Diagram

The **Level 0 Context Diagram** models the entire application as a single high-level process boundary, detailing the external entities that interact with the system and the fundamental inputs and outputs exchanged.

```mermaid
flowchart TB
    subgraph EXTERNAL_ENTITIES["External Entities"]
        USER["👤 SOC Analyst / Security Engineer<br/>(Web Browser Client)"]
        STREAM["🌐 Network Traffic / Syslog Feeder<br/>(Firewalls, IDS, Servers)"]
        LLM["🤖 External Cloud LLM Engine<br/>(Groq LLaMA 3.3 / OpenAI)"]
        ADMIN["🛠️ DevOps / System Administrator<br/>(CLI / Cloud Console)"]
    end

    subgraph SYSTEM_BOUNDARY["System Process Boundary"]
        CORE(("0.0<br/>AI-Powered Network<br/>Security Incident<br/>Analysis System"))
    end

    subgraph PERSISTENCE["Data Storage Layer"]
        DB[("MongoDB / Local Cache<br/>(Telemetry & Incidents)")]
    end

    %% Inputs
    USER -->|"1. Live telemetry features / Raw log strings / Status updates"| CORE
    STREAM -->|"2. Batch CSV telemetry / Raw syslog streaming"| CORE
    ADMIN -->|"3. Model evaluation benchmarks / Config / Credentials"| CORE
    LLM -->|"4. Synthesized incident explanations & recommendations"| CORE
    DB -->|"5. Stored incident records / Aggregated statistics"| CORE

    %% Outputs
    CORE -->|"6. Real-time predictions, probabilities & DEFCON metrics"| USER
    CORE -->|"7. Ingestion confirmation & batch parsing summary"| STREAM
    CORE -->|"8. Formatted incident prompts & telemetry context"| LLM
    CORE -->|"9. System health status, inference logs & benchmarks"| ADMIN
    CORE -->|"10. Persisted incident records, extracted logs & audits"| DB
```

---

## 3. DFD Level 1: Subsystem Data Flow Diagram

The **Level 1 DFD** decomposes the single root process into the 8 core operational sub-processes and maps their interactions with system data stores:

```mermaid
flowchart TB
    %% External Entities
    ANALYST["👤 SOC Analyst"]
    FEEDER["🌐 Syslog / Telemetry Feeder"]
    CLOUD_AI["🤖 Cloud LLM Service"]

    %% Data Stores
    D1[("D1: Incidents Collection<br/>(MongoDB / Local JSON)")]
    D2[("D2: Raw Logs Collection")]
    D3[("D3: Pretrained Weights<br/>(final_network_security_xgboost.pkl)")]
    D4[("D4: Attack Knowledge Base<br/>(Offline Remediation KB)")]

    %% Processes
    P1["1.0 Ingestion &<br/>Protocol Parsing"]
    P2["2.0 NLP Log Entity<br/>Extraction & Regex"]
    P3["3.0 Feature Formulation<br/>& Vector Scaling"]
    P4["4.0 XGBoost Multi-Class<br/>Inference Engine"]
    P5["5.0 Dynamic Risk &<br/>Severity Computation"]
    P6["6.0 Generative AI<br/>Remediation Synthesis"]
    P7["7.0 Persistence &<br/>Audit Management"]
    P8["8.0 Tactical SOC Dashboard<br/>Aggregation & HUD"]

    %% Data Flows
    FEEDER -->|"Raw Syslog / CSV"| P1
    ANALYST -->|"Live Packet Features"| P1
    ANALYST -->|"Status Mutation (e.g. 'resolved')"| P7

    P1 -->|"Unstructured Log String"| P2
    P1 -->|"Raw Structured Metrics"| P3

    P2 -->|"Extracted IPs, Ports, Protocols, Fails"| P3
    P2 -->|"Extracted Log Payload"| P7

    P3 -->|"Normalized 194-Dim Array"| P4
    D3 -->|"Model Artifacts & Scalers"| P3
    D3 -->|"Trained Estimator"| P4

    P4 -->|"Class & Probabilities"| P5
    P2 -->|"Failed Attempts & Ports"| P5

    P5 -->|"Risk Score (0-100) & Severity"| P6
    P4 -->|"Predicted Attack Type"| P6
    P2 -->|"Network Context"| P6

    P6 <-->|"Prompt & Response"| CLOUD_AI
    D4 -->|"Offline Mitigation Fallback"| P6

    P4 & P5 & P6 -->|"Incident Data Packet"| P7
    P7 -->|"Insert Incident Record"| D1
    P7 -->|"Insert Raw Log Document"| D2

    D1 -->|"Historical Records"| P8
    P8 -->|"DEFCON Posture, Trend Curves, Metrics"| ANALYST
```

---

## 4. DFD Level 2: Detailed Process Decompositions

### 4.1 Process 2.0: NLP Entity Extraction & Keyword Matching
This process breaks down unstructured text streams into normalized forensic entities.

```mermaid
flowchart LR
    RAW_TXT["Raw Log Text Input"] --> P2_1["2.1 IPv4 Pattern Matcher<br/>(Regex Bounds)"]
    RAW_TXT --> P2_2["2.2 Port & Protocol Extractor<br/>(Regex Search)"]
    RAW_TXT --> P2_3["2.3 Auth & User Extractor<br/>(Failed Attempts Counter)"]
    RAW_TXT --> P2_4["2.4 Threat Keyword Scanner<br/>(SQLi, DoS, Shellcode, etc.)"]

    P2_1 -->|"Source & Target IPs"| ENTITY_AGG["2.5 Entity Aggregator & Normalizer"]
    P2_2 -->|"Port Number & Protocol (TCP/UDP)"| ENTITY_AGG
    P2_3 -->|"User Accounts & Failed Count"| ENTITY_AGG
    P2_4 -->|"Matched Security Flags"| ENTITY_AGG

    ENTITY_AGG --> STRUCT_ENTITIES["Structured ExtractedEntities Object"]
```

### 4.2 Process 3.0 & 4.0: Feature Preprocessing & XGBoost Classification
Transforms raw attributes into a 194-dimensional matrix aligned with UNSW-NB15 and runs XGBoost classification.

```mermaid
flowchart TD
    IN_DATA["Input Features + Extracted Entities"] --> P3_1["3.1 Missing Value Imputation<br/>(UNSW_NUMERICAL_DEFAULTS)"]
    
    P3_1 --> P3_2["3.2 Numerical Split (39 cols)<br/>(dur, spkts, dpkts, sbytes, rate, etc.)"]
    P3_1 --> P3_3["3.3 Categorical Split (3 cols)<br/>(proto, service, state)"]

    P3_2 --> P3_4["3.4 StandardScaler Transform<br/>(Zero Mean, Unit Variance)"]
    P3_3 --> P3_5["3.5 OneHotEncoder Transform<br/>(Sparse Categorical Matrix)"]

    P3_4 --> P3_6["3.6 Matrix Stacking<br/>(np.hstack: 194 Features)"]
    P3_5 --> P3_6

    P3_6 --> P4_1["4.1 XGBoost Softmax Evaluation<br/>(predict_proba)"]
    P4_1 --> P4_2["4.2 Class Extraction<br/>(argmax class index)"]
    P4_1 --> P4_3["4.3 Confidence Scoring<br/>(Max Probability Extraction)"]
    P4_1 --> P4_4["4.4 Full Distribution Map<br/>(10 Attack Class Probabilities)"]

    P4_2 & P4_3 & P4_4 --> OUT_ML["ML Inference Output Payload"]
```

### 4.3 Process 5.0: Dynamic CVSS-Aligned Risk Assessment
Calculates an explainable 0–100 risk score and maps to tactical severity bands.

```mermaid
flowchart TD
    ML_IN["Attack Class & Confidence"] --> P5_1["5.1 Base Score Lookup<br/>(ATTACK_BASE_SCORES)"]
    CONF_IN["Model Confidence Score"] --> P5_2["5.2 Confidence Scaling<br/>((conf - 0.7) * 20)"]
    PORT_IN["Target Destination Port"] --> P5_3["5.3 Critical Port Evaluator<br/>(22, 3389, 445, 1433, 3306)"]
    FAILS_IN["Failed Logins Count"] --> P5_4["5.4 Brute Force Anomaly<br/>(Failed Attempts Modifier)"]
    KEYS_IN["Matched Threat Keywords"] --> P5_5["5.5 Keyword Multiplier<br/>(len(keywords) * 4)"]

    P5_1 & P5_2 & P5_3 & P5_4 & P5_5 --> P5_6["5.6 Sum & Boundary Clamping<br/>(Score ∈ [0, 100])"]

    P5_6 --> P5_7{"5.7 Severity Tier Mapping"}
    P5_7 -->|"0 - 30"| SEV_LOW["LOW Severity (Green)"]
    P5_7 -->|"31 - 60"| SEV_MED["MEDIUM Severity (Cyan)"]
    P5_7 -->|"61 - 80"| SEV_HIGH["HIGH Severity (Amber)"]
    P5_7 -->|"81 - 100"| SEV_CRIT["CRITICAL Severity (Crimson)"]
```

### 4.4 Process 6.0: Generative AI Root-Cause & Playbook Generation
Provides dual-mode contextual explanation of the incident.

```mermaid
flowchart TD
    INPUT["Incident Telemetry Package<br/>(Attack Type, Risk Score, IPs, Ports, Log)"] --> P6_1{"6.1 API Key & Provider Check"}
    
    P6_1 -->|"GROQ_API_KEY Present"| P6_2["6.2 Groq LLaMA 3.3 Prompt Assembly"]
    P6_1 -->|"OPENAI_API_KEY Present"| P6_3["6.3 OpenAI GPT-4o Prompt Assembly"]
    P6_1 -->|"No Cloud Keys / Offline"| P6_4["6.4 Consult Local Cybersecurity Knowledge Base"]

    P6_2 --> P6_5{"6.5 Remote API Execution"}
    P6_3 --> P6_5

    P6_5 -->|"HTTP 200 OK (Valid JSON)"| P6_6["6.6 Parse LLM JSON Response"]
    P6_5 -->|"Timeout / 429 / Exception"| P6_4

    P6_4 --> P6_7["6.7 Deterministic Template Synthesis<br/>(Forensic Summary, Impact, Mitigations)"]

    P6_6 & P6_7 --> P6_8["6.8 Structure Standard ExplainResponse Payload"]
```

---

## 5. End-to-End System Process Flows & Sequence Diagrams

### 5.1 Sequence Diagram: Real-Time Live Network Telemetry Analysis
Demonstrates what occurs when a SOC Analyst inputs packet telemetry into the **Live Event Analyzer**:

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as 👤 SOC Analyst
    participant Frontend as 💻 React UI (LiveAnalyzerView)
    participant Gateway as 🚪 FastAPI (/api/analyze)
    participant NLP as 🔍 NLPLogService
    participant ML as 🧠 MLService (XGBoost)
    participant Risk as ⚖️ RiskService
    participant GenAI as 🤖 GenAIService
    participant DB as 🗄️ DatabaseService (MongoDB)

    Analyst->>Frontend: Select preset or input packet metrics (sbytes, dur, proto...)
    Analyst->>Frontend: Clicks "Analyze Live Event"
    Frontend->>Gateway: POST /api/analyze (JSON payload)
    
    opt Log Text is Present
        Gateway->>NLP: extract_entities(log_text)
        NLP-->>Gateway: ExtractedEntities (IPs, Port, Proto, Fails)
    end

    Gateway->>ML: predict(feature_data)
    ML->>ML: prepare_features (OneHot + StandardScaler)
    ML->>ML: model.predict_proba(194-dim vector)
    ML-->>Gateway: attack_type, is_attack, confidence, probabilities

    Gateway->>Risk: calculate_risk_score(attack, conf, fails, port, keywords)
    Risk-->>Gateway: risk_score (0-100), severity (CRITICAL)

    Gateway->>GenAI: explain_incident(incident_packet)
    GenAI-->>Gateway: ai_explanation (summary, impact, recommendations)

    Gateway->>DB: insert_incident(incident_document)
    DB-->>Gateway: incident_id ("inc-a8f3b291")

    Gateway-->>Frontend: HTTP 200 OK (AnalyzeResponse)
    Frontend->>Frontend: Update DEFCON state & render Probability Distribution Chart
    Frontend-->>Analyst: Visual confirmation & tactical playbook displayed
```

---

### 5.2 Sequence Diagram: Batch Syslog Upload & Ingestion Pipeline
Demonstrates how bulk log files (auth logs, firewall CSVs) are digested:

```mermaid
sequenceDiagram
    autonumber
    actor Feeder as 🌐 Syslog Feeder / Analyst
    participant Gateway as 🚪 FastAPI (/api/log/upload)
    participant NLP as 🔍 NLPLogService
    participant ML as 🧠 MLService
    participant Risk as ⚖️ RiskService
    participant DB as 🗄️ DatabaseService

    Feeder->>Gateway: POST /api/log/upload (Multipart File: auth.log / CSV)
    Gateway->>Gateway: Read file stream & split into line buffers
    
    loop For each log event in batch
        Gateway->>NLP: extract_entities(line)
        NLP-->>Gateway: Extracted fields
        Gateway->>ML: predict(fields)
        ML-->>Gateway: attack_type, confidence
        Gateway->>Risk: calculate_risk_score(...)
        Risk-->>Gateway: risk_score, severity
        Gateway->>DB: insert_log & insert_incident
    end

    Gateway-->>Feeder: HTTP 200 OK (LogUploadSummary: Total, Attacks, HighRisk)
```

---

### 5.3 Sequence Diagram: On-Demand Incident Investigation & AI Playbook
Demonstrates an analyst opening an incident from the registry to request a tailored remediation plan:

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as 👤 SOC Analyst
    participant Frontend as 💻 React UI (IncidentExplorerView)
    participant Gateway as 🚪 FastAPI (/api/explain)
    participant GenAI as 🤖 GenAIService
    participant CloudLLM as ☁️ Groq Cloud API

    Analyst->>Frontend: Selects Incident from Registry -> Clicks "AI Explain"
    Frontend->>Gateway: POST /api/explain (incident_id, attack_type, telemetry)
    Gateway->>GenAI: explain_incident(incident_data)

    alt Groq API Available
        GenAI->>CloudLLM: POST /v1/chat/completions (llama-3.3-70b-versatile)
        CloudLLM-->>GenAI: JSON (Executive Summary, Impact, Playbook)
    else Cloud Unavailable / Timeout
        GenAI->>GenAI: Retrieve from ATTACK_KNOWLEDGE_BASE
    end

    GenAI-->>Gateway: ExplainResponse object
    Gateway-->>Frontend: HTTP 200 OK
    Frontend-->>Analyst: Displays Forensic Evidence & Step-by-Step SOC Playbook
```

---

### 5.4 Sequence Diagram: Executive Dashboard Aggregation & DEFCON Alerting
Demonstrates background polling and real-time posture synchronization:

```mermaid
sequenceDiagram
    autonumber
    participant Frontend as 💻 React UI (DashboardView)
    participant Gateway as 🚪 FastAPI (/api/dashboard)
    participant DB as 🗄️ DatabaseService (MongoDB)

    loop Every 10 Seconds (Background Sync)
        Frontend->>Gateway: GET /api/dashboard
        Gateway->>DB: get_dashboard_stats()
        DB->>DB: Run MongoDB Aggregation Pipeline on 'incidents'
        DB-->>Gateway: Aggregated counts, attack distribution, top ports
        Gateway-->>Frontend: HTTP 200 OK (DashboardStats)
        Frontend->>Frontend: Calculate DEFCON Level:
        Note over Frontend: If Critical > 0 -> DEFCON 1<br/>If High > 0 -> DEFCON 2<br/>If Medium > 0 -> DEFCON 3<br/>Else -> DEFCON 5 (NORMAL)
        Frontend->>Frontend: Re-render Recharts Attack Trends & Port Vulnerability Bars
    end
```

---

## 6. Data Dictionary & Data Flow Matrix

| Data Flow Name | Originating Subsystem | Destination Subsystem | Data Structure / Schema | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`AnalyzeRequest`** | Frontend Client | `/api/analyze` | Pydantic `AnalyzeRequest` | Contains packet metrics (`dur`, `sbytes`, `proto`) or raw `log_text`. |
| **`ExtractedEntities`** | `NLPLogService` | Route Handler | Pydantic `ExtractedEntities` | Structured IPs, destination port, protocol, username, and failed attempts. |
| **`FeatureMatrix (194-d)`** | `MLService` | XGBoost Model | `np.ndarray (1, 194)` | Preprocessed, scaled, and one-hot encoded numeric vector. |
| **`MLPrediction`** | XGBoost Estimator | Route Handler | `Tuple[str, bool, float, dict]` | Predicted attack label, binary flag, confidence float, and 10-class probability map. |
| **`RiskAssessment`** | `RiskService` | Route Handler | `Tuple[int, str]` | Integer risk score (0–100) and severity band (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). |
| **`ExplainResponse`** | `GenAIService` | Frontend Client | Pydantic `ExplainResponse` | Incident summary, forensic evidence, impact assessment, and investigation steps. |
| **`DashboardStats`** | `DatabaseService` | Frontend Client | Pydantic `DashboardStats` | Overview counts, attack distribution breakdown, temporal trends, and top ports. |
