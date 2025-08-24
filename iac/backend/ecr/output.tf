
output "admin_api_lambda_ecr_url" {
  description = "admin api lambda repository"
  value       = module.admin_api_lambda.repository_uri
}


output "public_api_lambda_ecr_url" {
  description = "public api lambda repository"
  value       = module.public_api_lambda.repository_uri
}
