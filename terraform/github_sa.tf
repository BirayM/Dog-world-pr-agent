# Pool d'identité
resource "google_iam_workload_identity_pool" "dog-github-pool" {
  project                   = var.project_id
  workload_identity_pool_id = "dog-github-pool"
  display_name              = "Dog GitHub Actions Pool"
  disabled                  = false
}

# Provider OIDC GitHub
resource "google_iam_workload_identity_pool_provider" "dog-github-provider" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.dog-github-pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "dog-github-provider"
  display_name                       = "Dog GitHub Actions Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }

  # Restreint à votre org/repo
  attribute_condition = "assertion.repository == 'Dog-word-pr-agent'"
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Service Account à impersonner
resource "google_service_account" "dog_github_deploy" {
  project      = var.project_id
  account_id   = "github-deploy"
  display_name = "GitHub Actions Deploy"
}

# Rôles sur le projet (à adapter)
resource "google_project_iam_member" "sa_roles" {
  for_each = toset([
    "roles/artifactregistry.writer",
    "roles/run.admin",
    "roles/storage.admin",
    "roles/iam.serviceAccountUser",
    "roles/iam.serviceAccountTokenCreator",
    "roles/serviceusage.serviceUsageAdmin"
  ])
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.dog_github_deploy.email}"
}

# Autoriser l'impersonation par le repo GitHub
resource "google_service_account_iam_member" "wif_impersonation" {
  service_account_id = google_service_account.dog_github_deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.dog-github-pool.name}/attribute.repository/Dog-word-pr-agent/Dog-word-pr-agent"
}   