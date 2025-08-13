output "admin_api_lambda" {
  description = "admin api lambda"
  value       = aws_iam_policy.admin_api_lambda
}


output "public_api_lambda" {
  description = "public api lambda"
  value       = aws_iam_policy.public_api_lambda
}
