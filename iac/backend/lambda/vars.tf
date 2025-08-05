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

variable "ecr" {
  description = "ecr module outputs"
  type = object({
    admin_api_lambda_ecr_url = string
  })
}
variable "admin_api_lambda_image_tag" {
  description = "admin api lambda image tag"
  type        = string
}

