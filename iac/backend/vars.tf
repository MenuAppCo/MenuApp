variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "app" {
  description = "Application name"
  type        = string
  default     = "menupp"
}

variable "DATABASE_URL" {
  description = "Database connection URL"
  type        = string
  sensitive   = true
}


variable "ADMIN_BACKEND_IMAGE_TAG" {
  description = "Admin backend image tag"
  type        = string
  sensitive   = false
}
