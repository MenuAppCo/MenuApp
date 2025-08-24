resource "aws_ecr_repository" "this" {
  name = var.repository_name
  image_scanning_configuration {
    scan_on_push = var.image_scanning_configuration
  }

  image_tag_mutability = "IMMUTABLE"

  tags = var.tags

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.this.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire images when more than 10 exist"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
