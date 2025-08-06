output "admin_api_domain_cloudfront_domain_name" {
  value = aws_api_gateway_domain_name.admin_api_domain.cloudfront_domain_name
}