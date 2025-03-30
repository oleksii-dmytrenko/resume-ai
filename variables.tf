variable "openai_api_key" {
  description = "OpenAI API Key"
  type        = string
  sensitive   = true
}

variable "leonardo_api_key" {
  description = "Leonardo AI API Key"
  type        = string
  sensitive   = true
}

variable "vercel_token" {
  description = "Vercel API Token"
  type        = string
  sensitive   = true
} 