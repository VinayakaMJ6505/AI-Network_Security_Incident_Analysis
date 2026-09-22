# 🛡️ AI-Powered Network Security Incident Analysis System

An AI-powered cybersecurity platform designed to detect, classify, analyze, and explain network security incidents using **Artificial Intelligence, Machine Learning, Big Data Analytics, Natural Language Processing, and Generative AI**.

The system analyzes network traffic and security logs, identifies potential attacks, calculates risk levels, extracts important information from unstructured logs, and generates human-readable incident explanations and recommended investigation steps.

---

## 📌 Project Overview

Modern networks generate a large volume of network traffic, firewall logs, IDS alerts, and server logs. Manually analyzing these events can be time-consuming and difficult, especially when the number of security events increases.

This project aims to develop an intelligent security incident analysis system that can:

- Detect normal and malicious network traffic
- Classify different types of network attacks
- Analyze large volumes of security events
- Extract important information from security logs
- Calculate incident risk and severity
- Generate understandable incident explanations
- Provide recommended investigation steps
- Visualize security incidents through a web dashboard
- Store and manage security incident information

The project integrates multiple technologies into a single security analysis workflow.

---

# 🎯 Objectives

The main objectives of the project are:

1. Develop a machine learning-based network intrusion detection system.
2. Detect whether network activity is normal or malicious.
3. Classify malicious traffic into different attack categories.
4. Perform exploratory and large-scale security data analysis.
5. Extract information such as IP addresses, ports, protocols, timestamps, and usernames from security logs.
6. Calculate risk scores and severity levels for detected incidents.
7. Use Generative AI to explain detected security incidents.
8. Provide recommended investigation steps.
9. Store security events and incident information in a database.
10. Provide an interactive dashboard for security monitoring.
11. Demonstrate cloud-based deployment of the application.

---

# 🧠 Technologies and Domains

| Domain | Technology / Application |
|---|---|
| Artificial Intelligence & Machine Learning | Attack detection and classification |
| Big Data Analytics | Large-scale security event analysis |
| Natural Language Processing | Security log information extraction |
| Generative AI | Incident explanation and recommendations |
| Cloud Computing | Cloud deployment |
| Database | MongoDB |
| Backend | FastAPI |
| Frontend | React.js |
| Data Processing | Pandas, NumPy |
| Big Data Processing | PySpark |
| Machine Learning | Scikit-learn, XGBoost |
| NLP | Regex, spaCy |
| Visualization | Matplotlib, Seaborn, Recharts |

---

# 🏗️ System Architecture

```text
                  ┌──────────────────────────┐
                  │   Network Traffic / Logs │
                  │       CSV / JSON / TXT   │
                  └─────────────┬────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │ Data Collection &        │
                  │ Preprocessing            │
                  │ Pandas / NumPy           │
                  └─────────────┬────────────┘
                                │
               ┌────────────────┴────────────────┐
               │                                 │
               ▼                                 ▼
      ┌──────────────────┐             ┌──────────────────┐
      │ Machine Learning │             │ NLP Log Analysis │
      │                  │             │                  │
      │ Attack Detection │             │ Entity Extraction│
      │ Classification   │             │ Log Processing   │
      └────────┬─────────┘             └────────┬─────────┘
               │                                │
               └────────────────┬───────────────┘
                                ▼
                    ┌────────────────────────┐
                    │ Incident Analysis      │
                    │                        │
                    │ Attack Type            │
                    │ Confidence             │
                    │ Risk Score             │
                    │ Severity               │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ Generative AI          │
                    │                        │
                    │ Incident Explanation   │
                    │ Evidence Summary       │
                    │ Recommendations        │
                    └────────────┬───────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
         ┌──────────────────┐          ┌──────────────────┐
         │ MongoDB Database │          │ Big Data         │
         │                  │          │ Analytics        │
         │ Logs             │          │ PySpark          │
         │ Incidents        │          │ Aggregations     │
         │ Predictions      │          │ Trends           │
         └────────┬─────────┘          └────────┬─────────┘
                  │                             │
                  └──────────────┬──────────────┘
                                 ▼
                    ┌────────────────────────┐
                    │ Security Dashboard     │
                    │ React.js               │
                    │                        │
                    │ Threats                │
                    │ Incidents              │
                    │ Analytics              │
                    │ AI Explanations        │
                    └────────────────────────┘
```

---

# 🔄 System Workflow

```text
Network Security Data
        ↓
Data Preprocessing
        ↓
Exploratory Data Analysis
        ↓
Machine Learning
        ↓
Attack Detection
        ↓
Attack Classification
        ↓
NLP Log Analysis
        ↓
Risk & Severity Assessment
        ↓
Generative AI Analysis
        ↓
Database Storage
        ↓
Big Data Analytics
        ↓
Security Dashboard
```

---

# 📊 Dataset

## UNSW-NB15

The machine learning component uses the **UNSW-NB15** cybersecurity dataset.

The dataset contains normal network traffic and multiple categories of malicious network activity.

### Attack Categories

The dataset includes categories such as:

- Fuzzers
- Analysis
- Backdoors
- DoS
- Exploits
- Generic
- Reconnaissance
- Shellcode
- Worms

### Dataset Source

Official UNSW-NB15 Dataset:

https://research.unsw.edu.au/projects/unsw-nb15-dataset

> Dataset credits: Australian Centre for Cyber Security (ACCS), UNSW.

---

# 🤖 Machine Learning Module

The machine learning module is responsible for detecting and classifying network activity.

## ML Tasks

### 1. Binary Classification

The first model determines whether network activity is:

```text
Normal
   OR
Attack
```

This answers:

> Is this network activity potentially malicious?

### 2. Multiclass Classification

The second task identifies the attack category:

```text
Normal
Fuzzers
Analysis
Backdoors
DoS
Exploits
Generic
Reconnaissance
Shellcode
Worms
```

This answers:

> What type of network security incident was detected?

---

# 🧪 Machine Learning Models

The project evaluates multiple machine learning algorithms.

### Logistic Regression

Used as a baseline classification model.

### Random Forest

Used for network traffic classification and feature importance analysis.

### XGBoost

Used as an additional tree-based machine learning model for attack classification.

---

# 📈 Model Evaluation

The models are evaluated using:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix
- Classification Report

Example evaluation structure:

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---:|---:|---:|---:|
| Logistic Regression | TBD | TBD | TBD | TBD |
| Random Forest | TBD | TBD | TBD | TBD |
| XGBoost | TBD | TBD | TBD | TBD |

> Final values will be added after model training and evaluation.

---

# 🧹 Data Preprocessing

The preprocessing pipeline includes:

```text
Raw Dataset
     ↓
Data Inspection
     ↓
Missing Value Analysis
     ↓
Duplicate Detection
     ↓
Feature Selection
     ↓
Categorical Feature Encoding
     ↓
Target Encoding
     ↓
Feature Preparation
     ↓
Training / Testing
```

Categorical network features such as:

- Protocol
- Service
- State

are processed before being provided to the machine learning models.

---

# 📝 NLP Module

Security logs often contain important information in unstructured text.

The NLP module extracts useful information from security logs.

### Information Extracted

- Source IP address
- Destination IP address
- Port number
- Protocol
- Timestamp
- Username
- Failed authentication attempts
- Security event descriptions
- Attack-related keywords

### Example

**Input:**

```text
2026-09-22 10:15:32
Blocked connection from 192.168.1.45
to server 10.0.0.10 using TCP port 22.
User admin generated 35 failed authentication attempts.
```

**Output:**

```json
{
  "source_ip": "192.168.1.45",
  "destination_ip": "10.0.0.10",
  "protocol": "TCP",
  "port": 22,
  "username": "admin",
  "failed_attempts": 35
}
```

The NLP component uses techniques such as:

- Regular expressions
- Text preprocessing
- Entity extraction
- spaCy-based NLP processing

---

# 📊 Big Data Analytics

Cybersecurity systems can generate a large number of events.

The project uses **Apache Spark / PySpark** for large-scale security event analysis.

### Analytics Include

- Number of security events
- Attack frequency
- Attack distribution
- Top source IPs
- Top destination ports
- Protocol distribution
- Attack trends over time
- Frequently targeted services
- Security event aggregation

Example:

```text
Security Events
       ↓
PySpark DataFrame
       ↓
Filtering
       ↓
Grouping
       ↓
Aggregation
       ↓
Security Analytics
```

---

# ⚠️ Risk Assessment

The system calculates a risk score for detected incidents.

Example factors include:

```text
Attack Type
ML Confidence
Attack Frequency
Event Characteristics
Target Information
```

The resulting score is mapped to severity levels:

```text
0 – 30       LOW
31 – 60      MEDIUM
61 – 80      HIGH
81 – 100     CRITICAL
```

Example:

```text
Attack Type : Brute Force
Confidence  : 94%
Risk Score  : 87
Severity    : HIGH
```

The scoring rules will be documented in the implementation to make the assessment transparent and reproducible.

---

# ✨ Generative AI Module

Generative AI is used after the machine learning system has detected and classified an incident.

The ML system provides structured information to the GenAI component.

Example:

```json
{
  "attack_type": "Brute Force",
  "confidence": 0.94,
  "risk_score": 87,
  "source_ip": "192.168.1.45",
  "destination_port": 22,
  "protocol": "TCP"
}
```

The GenAI module generates:

### Incident Summary

A natural-language description of the detected incident.

### Evidence

A summary of the information associated with the classification.

### Potential Impact

A description of possible security implications based on the available information.

### Investigation Recommendations

Suggested investigation steps for a security administrator.

The GenAI component is intended to explain the results produced by the analytical pipeline rather than replace the machine learning classifier.

---

# 🗄️ Database

MongoDB is used to store application and security information.

## Collections

```text
users
logs
incidents
predictions
analysis_reports
```

Example incident document:

```json
{
  "source_ip": "192.168.1.45",
  "destination_ip": "10.0.0.10",
  "port": 22,
  "protocol": "TCP",
  "attack_type": "Brute Force",
  "confidence": 0.94,
  "risk_score": 87,
  "severity": "HIGH",
  "timestamp": "2026-09-22T10:15:32"
}
```

---

# 🚀 Backend

The backend is developed using **Python FastAPI**.

## Main API Endpoints

### Analyze Security Event

```http
POST /api/analyze
```

Analyze a network security event.

### Upload Security Log

```http
POST /api/log/upload
```

Upload a security log or dataset.

### Retrieve Incidents

```http
GET /api/incidents
```

Retrieve detected incidents.

### Retrieve Incident Details

```http
GET /api/incidents/{id}
```

Retrieve details of a specific incident.

### Dashboard Statistics

```http
GET /api/dashboard
```

Retrieve dashboard statistics.

### Generate AI Explanation

```http
POST /api/explain
```

Generate an AI-based incident explanation.

---

# 💻 Frontend

The web interface is developed using **React.js**.

## Dashboard Components

### Security Overview

Displays:

- Total events
- Detected attacks
- High-risk incidents
- Critical incidents

### Attack Distribution

Displays the number of incidents by attack category.

### Attack Trends

Displays security events over time.

### Recent Incidents

Displays:

```text
Source IP
Attack Type
Risk Score
Severity
Timestamp
```

### Incident Details

Provides:

- Attack classification
- Confidence
- Risk score
- Severity
- Extracted entities
- AI-generated explanation
- Investigation recommendations

---

# ☁️ Cloud Computing

The application can be deployed using cloud services.

Proposed architecture:

```text
              Internet
                 │
                 ▼
        ┌─────────────────┐
        │ React Frontend  │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ FastAPI Backend │
        └───────┬─────────┘
                │
       ┌────────┼─────────┐
       ▼        ▼         ▼
   ML Model  MongoDB   GenAI API
```

Possible deployment services include:

- Render
- Railway
- AWS
- Microsoft Azure
- MongoDB Atlas

The final deployment platform may depend on the project configuration.

---

# 📁 Project Structure

```text
AI-Powered-Network-Security-Incident-Analysis/
│
├── data/
│   ├── README.md
│   ├── UNSW_NB15_training-set.csv
│   └── UNSW_NB15_testing-set.csv
│
├── notebooks/
│   ├── 01_UNSW_NB15_Analysis.ipynb
│   ├── 02_NLP_Log_Analysis.ipynb
│   ├── 03_Big_Data_Analytics.ipynb
│   └── 04_GenAI_Incident_Analysis.ipynb
│
├── models/
│   └── security_classifier.pkl
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── utils/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
│   ├── architecture/
│   ├── screenshots/
│   └── project-report/
│
├── requirements.txt
├── .gitignore
└── README.md
```

> Large dataset files should not normally be committed to GitHub. Download the UNSW-NB15 dataset separately and place the required CSV files inside the `data/` directory.

---

# 📓 Jupyter Notebook

The machine learning development is initially performed using Jupyter Notebook.

The notebook covers:

```text
Dataset Loading
      ↓
Data Exploration
      ↓
Data Cleaning
      ↓
Feature Engineering
      ↓
Data Preprocessing
      ↓
Model Training
      ↓
Model Evaluation
      ↓
Model Comparison
      ↓
Feature Importance
      ↓
Prediction
      ↓
Model Saving
```

---

# 🛠️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Powered-Network-Security-Incident-Analysis.git
```

```bash
cd AI-Powered-Network-Security-Incident-Analysis
```

## 2. Create a Python Virtual Environment

### Windows

```bash
python -m venv venv
```

### Activate

```powershell
venv\Scripts\activate
```

## 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Main packages include:

```text
pandas
numpy
scikit-learn
xgboost
matplotlib
seaborn
jupyter
pyspark
spacy
fastapi
uvicorn
pymongo
joblib
```

---

# ▶️ Running the Jupyter Notebook

Start Jupyter Notebook:

```bash
jupyter notebook
```

Open:

```text
notebooks/01_UNSW_NB15_Analysis.ipynb
```

Run the notebook cells sequentially.

---

# ▶️ Running the Backend

Navigate to the backend:

```bash
cd backend
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ▶️ Running the Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

---

# 🔐 Security and Privacy

This project is intended for:

- Academic research
- Educational demonstrations
- Cybersecurity learning
- Network traffic analysis

The system should be tested using authorized datasets and environments only.

The project does not intentionally perform attacks against external systems.

---

# 📌 Project Status

### Current Development

- [x] Project concept finalized
- [x] UNSW-NB15 dataset selected
- [ ] Training dataset obtained
- [ ] Testing dataset obtained
- [ ] Data preprocessing
- [ ] Exploratory data analysis
- [ ] Binary classification
- [ ] Multiclass attack classification
- [ ] Model comparison
- [ ] NLP log analysis
- [ ] PySpark analytics
- [ ] Risk scoring
- [ ] Generative AI integration
- [ ] MongoDB integration
- [ ] FastAPI backend
- [ ] React dashboard
- [ ] Cloud deployment
- [ ] Testing and evaluation
- [ ] Final documentation

> Update the project status checklist as each module is implemented.

---

# 🔮 Future Enhancements

Possible future improvements include:

- Real-time network traffic ingestion
- Integration with IDS/IPS systems
- Real-time security alert streaming
- Kafka-based event processing
- Advanced deep learning models
- Transformer-based security log analysis
- Automated incident correlation
- Threat intelligence integration
- Real-time notification system
- Role-based access control
- Advanced security visualization
- Automated security report generation

---

# 📚 Academic Relevance

This project demonstrates the practical integration of:

### Artificial Intelligence and Machine Learning

Network intrusion detection and attack classification.

### Big Data Analytics

Processing and analyzing large volumes of security events.

### Natural Language Processing

Extracting structured information from unstructured security logs.

### Generative AI

Generating understandable incident explanations and investigation recommendations.

### Cloud Computing

Deploying the security analysis platform and its supporting services.

---

# 👨‍💻 Project Information

**Project Title:** AI-Powered Network Security Incident Analysis System

**Degree:** Master of Computer Applications (MCA)

**Institution:** Nitte Meenakshi Institute of Technology (NMIT), Bengaluru

**Project Type:** MCA Mini Project

**Domains:**

- Artificial Intelligence and Machine Learning
- Cybersecurity
- Big Data Analytics
- Natural Language Processing
- Generative AI
- Cloud Computing

---

# 📄 License

This project is developed for academic and educational purposes.

The UNSW-NB15 dataset is subject to its respective dataset terms and attribution requirements.

---

# ⭐ Acknowledgements

Special thanks to the researchers and institutions who developed and made the UNSW-NB15 dataset available for cybersecurity research and education.

### Dataset

**UNSW-NB15 Dataset:**

https://research.unsw.edu.au/projects/unsw-nb15-dataset
