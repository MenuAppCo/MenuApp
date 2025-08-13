output "admin_api_domain_regional_domain_name" {
  value = aws_api_gateway_domain_name.admin_api_domain.regional_domain_name
}

output "admin_api_domain_regional_zone_id" {
  value = aws_api_gateway_domain_name.admin_api_domain.regional_zone_id
}

output "public_api_domain_regional_domain_name" {
  value = aws_api_gateway_domain_name.public_api_domain.regional_domain_name
}

output "public_api_domain_regional_zone_id" {
  value = aws_api_gateway_domain_name.public_api_domain.regional_zone_id
}