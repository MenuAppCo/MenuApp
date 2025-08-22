output "images_bucket_name" {
  description = "images bucket name"
  value       = aws_s3_bucket.images.bucket
}


output "images_bucket_regional_domain_name" {
  description = "images bucket regional domain name"
  value       = aws_s3_bucket.images.bucket_regional_domain_name
}

output "images_bucket_id" {
  description = "images bucket id"
  value       = aws_s3_bucket.images.id
}
