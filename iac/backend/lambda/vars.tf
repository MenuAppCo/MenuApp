variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "app" {
  description = "Application name"
  type        = string
}


variable "iam" {
  description = "IAM module outputs"
  type = object({
    roles = object({
      admin_api_lambda = object({
        arn = string
      })
    })
  })
}

variable "database_url" {
  description = "Database connection URL"
  type        = string
  sensitive   = true
}

variable "s3" {
  description = "S3 module outputs"
  type = object({
    lambda_deployment_bucket_id = string
  })
} 