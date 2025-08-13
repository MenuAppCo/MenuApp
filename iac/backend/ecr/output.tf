output "admin_api_lambda_ecr_url" {
  description = "admin api lambda repository"
  value       = aws_ecr_repository.admin_api_lambda.repository_url
}

output "public_api_lambda_ecr_url" {
  description = "public api lambda repository"
  value       = aws_ecr_repository.public_api_lambda.repository_url
}
