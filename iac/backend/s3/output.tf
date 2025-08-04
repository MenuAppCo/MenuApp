output "lambda_deployment_bucket_arn" {
  description = "Lambda deployment bucket ARN"
  value       = aws_s3_bucket.lambda_deployment.arn
}

output "lambda_deployment_bucket_id" {
  description = "Lambda deployment bucket ID"
  value       = aws_s3_bucket.lambda_deployment.id
} 