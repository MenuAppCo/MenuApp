module "public_api_lambda" {
  source          = "../../modules/ecr"
  repository_name = "public-api-lambda"
  image_scanning_configuration = {
    scan_on_push = false
  }
  tags = {
    Environment = var.environment
    App         = var.app
  }
}
