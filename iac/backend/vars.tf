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

variable "SUPABASE_URL" {
  description = "Supabase URL"
  type        = string
  sensitive   = true
}

variable "SUPABASE_SERVICE_KEY" {
  description = "Supabase service key"
  type        = string
  sensitive   = true
}

variable "ADMIN_BACKEND_IMAGE_TAG" {
  description = "Admin backend image tag"
  type        = string
  sensitive   = false
}

variable "PUBLIC_BACKEND_IMAGE_TAG" {
  description = "Public backend image tag"
  type        = string
  sensitive   = false
}


variable "RESTAURANTS_FRONTEND_URL" {
  description = "restaurants frontend url"
  type        = string
}


variable "ADMIN_FRONTEND_URL" {
  description = "admin frontend url"
  type        = string
}