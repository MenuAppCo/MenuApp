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

variable "s3_media_bucket_regional_domain_name" {
  type        = string
  description = "s3 media bucket regional domain name"
}


variable "s3_media_bucket_id" {
  type        = string
  description = "s3 media bucket rid"
}

variable "menapp_certificate_arn" {
  type        = string
  description = "menapp certificate arn"
}
