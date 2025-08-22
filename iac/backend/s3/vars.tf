variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "app" {
  description = "Application name"
  type        = string
}

variable "media_cloudfront_arn" {
  description = "media cloudfront arn"
  type        = string
}
