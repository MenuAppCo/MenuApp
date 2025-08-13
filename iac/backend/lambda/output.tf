output "admin_api_lambda" {
  description = "admin api lambda"
  value       = aws_lambda_function.admin_api_lambda
}


output "public_api_lambda" {
  description = "public api lambda"
  value       = aws_lambda_function.public_api_lambda
}
