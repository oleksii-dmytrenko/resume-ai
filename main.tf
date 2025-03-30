terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.16"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_token
}

resource "vercel_project" "resume_ai" {
  name      = "resume-ai"
  framework = "nextjs"
  git_repository = {
    type = "github"
    repo = "oleksii-dmytrenko/resume-ai"
  }
}

resource "vercel_project_environment_variable" "openai_api_key" {
  project_id = vercel_project.resume_ai.id
  key        = "OPENAI_API_KEY"
  value      = var.openai_api_key
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "leonardo_api_key" {
  project_id = vercel_project.resume_ai.id
  key        = "LEONARDO_API_KEY"
  value      = var.leonardo_api_key
  target     = ["production", "preview", "development"]
} 