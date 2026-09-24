#!/usr/bin/env bash
# ============================================================
# deploy-gcp.sh  —  One-shot GCP setup + first deployment
#
# Prerequisites:
#   - gcloud CLI installed and authenticated  (gcloud auth login)
#   - Docker installed and running
#   - .env file filled in (copy from backend/.env.example)
#
# Usage:
#   ./deploy-gcp.sh <GCP_PROJECT_ID> [REGION]
#   Example:
#     ./deploy-gcp.sh my-project-id us-central1
# ============================================================
set -euo pipefail

PROJECT_ID="${1:?Usage: ./deploy-gcp.sh <GCP_PROJECT_ID> [REGION]}"
REGION="${2:-us-central1}"
REPO="ai-security"
BACKEND_SERVICE="ai-security-backend"
FRONTEND_SERVICE="ai-security-frontend"

echo ""
echo "============================================================"
echo "  AI-Network-Security  -->  GCP Cloud Run Deployment"
echo "  Project : $PROJECT_ID"
echo "  Region  : $REGION"
echo "============================================================"
echo ""

# ── 1. Set active project ─────────────────────────────────────
gcloud config set project "$PROJECT_ID"

# ── 2. Enable required GCP APIs ──────────────────────────────
echo "[1/7] Enabling GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  logging.googleapis.com \
  --project="$PROJECT_ID"

# ── 3. Create Artifact Registry repository ───────────────────
echo "[2/7] Creating Artifact Registry repository: $REPO ..."
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="AI Security Incident Analysis Docker images" \
  --project="$PROJECT_ID" 2>/dev/null || echo "  (repository already exists)"

# ── 4. Auth Docker for Artifact Registry ─────────────────────
echo "[3/7] Configuring Docker credentials..."
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

# ── 5. Build & push backend ───────────────────────────────────
SHORT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "local")
BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/backend:${SHORT_SHA}"
BACKEND_LATEST="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/backend:latest"

echo "[4/7] Building backend Docker image..."
docker build -f Dockerfile.backend \
  -t "$BACKEND_IMAGE" \
  -t "$BACKEND_LATEST" \
  .

echo "      Pushing backend image..."
docker push "$BACKEND_IMAGE"
docker push "$BACKEND_LATEST"

# ── 6. Deploy backend to Cloud Run ───────────────────────────
echo "[5/7] Deploying backend to Cloud Run..."

# Load env vars from .env file if it exists
MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017}"
GROQ_API_KEY="${GROQ_API_KEY:-}"
OPENAI_API_KEY="${OPENAI_API_KEY:-}"

if [ -f "backend/.env" ]; then
  source backend/.env
fi

gcloud run deploy "$BACKEND_SERVICE" \
  --image="$BACKEND_IMAGE" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=0 \
  --max-instances=5 \
  --set-env-vars="MONGODB_URI=${MONGODB_URI},MONGODB_DB_NAME=incident_db,GROQ_API_KEY=${GROQ_API_KEY},OPENAI_API_KEY=${OPENAI_API_KEY}" \
  --project="$PROJECT_ID"

BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE" \
  --region="$REGION" \
  --format="value(status.url)" \
  --project="$PROJECT_ID")

echo "      Backend deployed at: $BACKEND_URL"

# Set ALLOWED_ORIGINS now that we have the final frontend URL (will update after frontend deploy)
gcloud run services update "$BACKEND_SERVICE" \
  --region="$REGION" \
  --update-env-vars="ALLOWED_ORIGINS=${BACKEND_URL}" \
  --project="$PROJECT_ID" 2>/dev/null || true

# ── 7. Build & push frontend ──────────────────────────────────
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend:${SHORT_SHA}"
FRONTEND_LATEST="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend:latest"

echo "[6/7] Building frontend Docker image (API_BASE_URL=$BACKEND_URL)..."
docker build -f Dockerfile.frontend \
  --build-arg "VITE_API_BASE_URL=${BACKEND_URL}" \
  -t "$FRONTEND_IMAGE" \
  -t "$FRONTEND_LATEST" \
  .

echo "      Pushing frontend image..."
docker push "$FRONTEND_IMAGE"
docker push "$FRONTEND_LATEST"

gcloud run deploy "$FRONTEND_SERVICE" \
  --image="$FRONTEND_IMAGE" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --project="$PROJECT_ID"

FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE" \
  --region="$REGION" \
  --format="value(status.url)" \
  --project="$PROJECT_ID")

# ── 8. Update backend CORS with final frontend URL ────────────
echo "[7/7] Updating backend ALLOWED_ORIGINS to $FRONTEND_URL ..."
gcloud run services update "$BACKEND_SERVICE" \
  --region="$REGION" \
  --update-env-vars="ALLOWED_ORIGINS=${FRONTEND_URL}" \
  --project="$PROJECT_ID"

echo ""
echo "============================================================"
echo "  DEPLOYMENT COMPLETE"
echo ""
echo "  Frontend  : $FRONTEND_URL"
echo "  Backend   : $BACKEND_URL"
echo "  API Docs  : $BACKEND_URL/docs"
echo "  Health    : $BACKEND_URL/api/health"
echo "============================================================"
echo ""
