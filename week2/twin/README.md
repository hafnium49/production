# AI Digital Twin - Week 2 Project

Production-ready AI Digital Twin with full CI/CD pipeline, deployed on AWS using Terraform.

## 🏗️ Architecture

### Infrastructure
- **Frontend**: Next.js 15 (App Router) static export hosted on S3 + CloudFront
- **Backend**: FastAPI Lambda function with API Gateway
- **AI**: AWS Bedrock with Amazon Nova Micro model
- **Memory**: S3-backed conversation persistence
- **IaC**: Terraform with S3 remote state and DynamoDB locking
- **CI/CD**: GitHub Actions with OIDC authentication

### AWS Resources
- Lambda Function (Python 3.12)
- API Gateway (HTTP API)
- S3 Buckets (frontend static site, memory storage, Terraform state)
- CloudFront Distribution (global CDN)
- DynamoDB Table (state locking)
- IAM Roles (Lambda execution, GitHub Actions)

## 📁 Project Structure

```
week2/twin/
├── backend/               # FastAPI Lambda backend
│   ├── server.py         # Main API with Bedrock integration
│   ├── lambda_handler.py # Lambda entry point
│   └── deploy.py         # Lambda package builder
├── frontend/             # Next.js frontend
│   ├── app/             # App Router pages
│   ├── components/      # React components
│   └── public/          # Static assets
├── terraform/           # Infrastructure as Code
│   ├── main.tf         # Core infrastructure
│   ├── variables.tf    # Input variables
│   ├── outputs.tf      # Output values
│   ├── backend.tf      # S3 backend configuration
│   ├── terraform.tfvars # Dev environment values
│   └── prod.tfvars     # Production values
└── scripts/            # Deployment automation
    ├── deploy.sh       # Mac/Linux deployment
    ├── deploy.ps1      # Windows deployment
    ├── destroy.sh      # Mac/Linux cleanup
    └── destroy.ps1     # Windows cleanup
```

## 🚀 Deployment

### Monorepo Setup

This project is part of a **monorepo** (`hafnium49/production`) containing multiple course projects. GitHub Actions workflows use path filters to trigger only on twin project changes:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'week2/twin/**'
```

### Automatic Deployment

**Trigger**: Push to `main` branch with changes in `week2/twin/`

**What happens**:
1. GitHub Actions detects changes via path filter
2. Workflow runs from `.github/workflows/deploy-twin.yml`
3. Authenticates to AWS via OIDC (no stored credentials)
4. Deploys to **dev** environment automatically
5. Invalidates CloudFront cache

### Manual Deployment

**Test or Production**: Go to [Actions](../../actions/workflows/deploy-twin.yml) → Run workflow

1. Click "Run workflow"
2. Select environment: `test` or `prod`
3. Click "Run workflow" button

### Local Deployment

**Mac/Linux**:
```bash
cd /path/to/production/week2/twin
./scripts/deploy.sh dev    # or test, prod
```

**Windows**:
```powershell
cd \path\to\production\week2\twin
.\scripts\deploy.ps1 -Environment dev    # or test, prod
```

## 🗑️ Destroying Environments

### Via GitHub Actions

**Manual Only** (no automatic destruction)

1. Go to [Actions](../../actions/workflows/destroy-twin.yml)
2. Click "Run workflow"
3. Select environment
4. Type environment name to confirm
5. Click "Run workflow"

### Local Destruction

**Mac/Linux**:
```bash
./scripts/destroy.sh dev    # or test, prod
```

**Windows**:
```powershell
.\scripts\destroy.ps1 -Environment dev    # or test, prod
```

## 🔒 Security

### OIDC Authentication
- No AWS access keys stored in GitHub
- Temporary credentials via OpenID Connect
- Session-based access with automatic expiration

### IAM Role
- **Name**: `github-actions-twin-deploy`
- **Trust Policy**: Only `hafnium49/production` repository
- **Permissions**: Scoped to Lambda, S3, API Gateway, CloudFront, Bedrock, DynamoDB

### Terraform State
- **Backend**: S3 bucket with encryption (AES256)
- **Locking**: DynamoDB table prevents concurrent modifications
- **Versioning**: Enabled for state rollback capability

## 🌍 Environments

### Dev
- **Purpose**: Development and testing
- **Deployment**: Automatic on push to main
- **Model**: Amazon Nova Micro (apac.amazon.nova-micro-v1:0)
- **API Throttle**: 10 burst, 5 rate

### Test
- **Purpose**: Pre-production validation
- **Deployment**: Manual via GitHub Actions
- **Model**: Amazon Nova Micro
- **API Throttle**: 10 burst, 5 rate

### Prod
- **Purpose**: Production (if using custom domain)
- **Deployment**: Manual via GitHub Actions
- **Model**: Amazon Nova Micro (can upgrade to Lite/Pro)
- **API Throttle**: 20 burst, 10 rate
- **Custom Domain**: Optional (set in prod.tfvars)

## 💰 Cost Optimization

### Baseline Costs (with environments destroyed)
- S3 State Bucket: ~$0.02/month
- DynamoDB Locks: ~$0.00/month
- **Total**: ~$0.02/month

### Per-Environment Costs (when running)
- Lambda: ~$0.20 per 1M requests
- API Gateway: ~$1 per 1M requests
- CloudFront: ~$0.085 per GB transferred
- Bedrock Nova Micro: ~$0.075 per 1M input tokens
- S3 Storage: ~$0.023 per GB/month

**Recommendation**: Destroy dev/test when not in use

## 🛠️ Development

### Local Development

**Backend**:
```bash
cd backend
uv run uvicorn server:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

**Access**: Frontend on http://localhost:3000, Backend on http://localhost:8000

### Testing Changes

1. Make changes locally
2. Test locally with dev servers
3. Commit and push to main
4. Automatic deployment to dev
5. Test on dev CloudFront URL
6. Deploy to test for validation
7. Deploy to prod when ready

## 📊 Monitoring

### CloudWatch Logs
- **Log Group**: `/aws/lambda/twin-{environment}-api`
- **Access**: AWS Console → CloudWatch → Log groups

### Deployment Logs
- **GitHub Actions**: [Actions tab](../../actions)
- **Terraform State**: S3 bucket `twin-terraform-state-{account-id}`

## 🔧 Troubleshooting

### Deployment Fails with "could not assume role"
- Verify GitHub secrets are configured correctly
- Check IAM role trust policy includes `hafnium49/production`

### CloudFront shows 404
- Wait 2-3 minutes for distribution to update
- Check S3 bucket has index.html
- Verify CloudFront invalidation ran

### Bedrock validation error
- Ensure using inference profile: `apac.amazon.nova-micro-v1:0`
- Check Bedrock model access enabled in AWS console

### State lock error
- Another deployment may be running
- Check DynamoDB table `twin-terraform-locks`
- Force unlock if stale: `terraform force-unlock <LOCK_ID>`

## 🔗 Useful Links

- **GitHub Repository**: https://github.com/hafnium49/production
- **AWS Console**: https://console.aws.amazon.com
- **Terraform Registry**: https://registry.terraform.io/providers/hashicorp/aws/latest/docs

## 📚 Course Context

This project is part of **Week 2** of the "AI in Production" course, focusing on:
- Infrastructure as Code with Terraform
- CI/CD pipelines with GitHub Actions
- AWS serverless deployment
- Production-ready architecture patterns

**Previous Week**: Week 1 - FastAPI deployment basics
**Next Week**: Week 3 - AWS Bedrock agents (external repository)

---

**Region**: ap-northeast-1 (Tokyo)
**Repository**: hafnium49/production
**Project Path**: week2/twin/
