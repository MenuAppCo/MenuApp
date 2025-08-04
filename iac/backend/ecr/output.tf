output "admin_api_lambda_ecr_url" {
  description = "admin api lambda repository"
  value       = aws_ecr_repository.admin_api_lambda.repository_url
}
