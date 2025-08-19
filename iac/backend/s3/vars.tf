variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "app" {
  description = "Application name"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 bucket name for storing images"
  type        = string
}