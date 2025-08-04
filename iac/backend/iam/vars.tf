variable "lambda_deployment_bucket_arn" {}
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

variable "lambda_deployment_bucket_arn" {}