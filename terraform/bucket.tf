terraform {
  cloud {
    organization = "gov-organization"
    workspaces {
      name = "dog-wordld-ai-agent"
    }
  }
}   