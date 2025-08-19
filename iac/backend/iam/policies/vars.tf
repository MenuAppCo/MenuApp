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

variable "s3_bucket_name" {
  description = "S3 bucket name for storing images"
  type        = string
}
