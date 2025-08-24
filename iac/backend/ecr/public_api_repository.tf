module "public_api_lambda" {
  source                        = "../../modules/ecr"
  repository_name               = "public-api-lambda"
  image_scanning_configuration  = false
  tags = {
    Environment = var.environment
    App         = var.app
  }
}
