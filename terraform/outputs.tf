output "service_account_email" {
  value       = google_service_account.dog_github_deploy.email
  description = "Email du service account à impersonner"
}

output "workload_identity_provider" {
  value       = google_iam_workload_identity_pool_provider.dog-github-provider.name
  description = "Chemin complet du provider WIF"
}

output "wif_pool_name" {
  value       = google_iam_workload_identity_pool.dog-github-pool.name
  description = "Chemin complet du pool WIF"
}   