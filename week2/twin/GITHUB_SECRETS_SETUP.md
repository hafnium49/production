# GitHub Secrets Setup - MANUAL STEP REQUIRED

## ⚠️ STOP - Manual Configuration Required

Before continuing with the automated CI/CD setup, you need to manually configure GitHub repository secrets.

## Step-by-Step Instructions

### 1. Navigate to GitHub Repository Settings

1. Go to https://github.com/hafnium49/production
2. Click the **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### 2. Add Required Secrets

Click **New repository secret** for each of the following three secrets:

#### Secret 1: AWS_ROLE_ARN
- **Name**: `AWS_ROLE_ARN`
- **Value**: `arn:aws:iam::960231572557:role/github-actions-twin-deploy`
- **Description**: IAM role that GitHub Actions will assume for AWS access

#### Secret 2: DEFAULT_AWS_REGION
- **Name**: `DEFAULT_AWS_REGION`
- **Value**: `ap-northeast-1`
- **Description**: Default AWS region for all deployments (Tokyo)

#### Secret 3: AWS_ACCOUNT_ID
- **Name**: `AWS_ACCOUNT_ID`
- **Value**: `960231572557`
- **Description**: Your AWS account ID

### 3. Verify Secrets Were Added

After adding all three secrets, you should see them listed on the Actions secrets page:
- AWS_ROLE_ARN
- AWS_ACCOUNT_ID
- DEFAULT_AWS_REGION

**Note**: GitHub never shows the actual secret values after they're created, only the names.

### 4. Security Notes

✅ **OIDC Authentication**: These secrets use OpenID Connect (OIDC) for secure, temporary AWS credentials
✅ **No Long-Lived Keys**: No AWS access keys are stored in GitHub
✅ **Role-Based Access**: GitHub Actions assumes an IAM role with specific permissions
✅ **Session-Based**: Credentials expire automatically after each workflow run

## What Happens Next

Once you've added these secrets:

1. **Continue the automation**: The CI/CD setup will proceed to update deployment scripts and create GitHub Actions workflows
2. **Automatic deployments**: Pushes to main branch will automatically deploy to dev environment
3. **Manual test/prod**: Test and production deployments require manual approval via GitHub Actions UI

## Troubleshooting

### If workflows fail with "could not assume role"
- Verify `AWS_ROLE_ARN` matches exactly: `arn:aws:iam::960231572557:role/github-actions-twin-deploy`
- Check that OIDC provider exists in AWS IAM
- Ensure trust policy includes repository: `hafnium49/production`

### If workflows fail with "region not found"
- Verify `DEFAULT_AWS_REGION` is set to: `ap-northeast-1`
- Check there are no extra spaces in the secret value

### If Terraform state errors occur
- Verify `AWS_ACCOUNT_ID` matches: `960231572557`
- Check S3 bucket exists: `twin-terraform-state-960231572557`
- Verify DynamoDB table exists: `twin-terraform-locks`

## Continue Automation

After completing these manual steps, you can continue the automated setup by running the next phase of the CI/CD implementation.

---

**Status**: ✅ AWS Infrastructure Ready | ⏳ GitHub Secrets Needed | ⏸️ Waiting for Manual Configuration
