resource "aws_ecr_repository" "public_api_lambda" {
  name                 = "public-api-lambda"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
    App         = var.app
  }
}
