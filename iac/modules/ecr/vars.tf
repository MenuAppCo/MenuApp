variable "repository_name" {
  description = "The name of the ECR repository."
  type        = string
}

variable "image_scanning_configuration" {
  description = "Configuration for image scanning on push."
  type        = bool
  default     = false
}

variable "lifecycle_policy" {
  description = "Lifecycle policy for the ECR repository."
  type        = string
  default     = null
}

variable "tags" {
  description = "A map of tags to assign to the ECR repository."
  type        = map(string)
  default     = {}
}