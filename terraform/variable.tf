variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "be-ai-agent-705f"
}

variable "project_number" {
  description = "GCP project ID"
  type        = string
  default     = "307706278628"
}

variable "region" {
  description = "GCP region (used for the static IP)"
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "GCP zone (used for the VM and the data disk)"
  type        = string
  default     = "europe-west1-b"
}
