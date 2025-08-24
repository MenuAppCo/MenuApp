output "repository_uri" {
  value = aws_ecr_repository.this.repository_url
}

output "repository_id" {
  value = aws_ecr_repository.this.id
}