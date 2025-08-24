module "admin_api_lambda" {
  source                        = "../../modules/ecr"
  repository_name               = "admin-api-lambda"
  image_scanning_configuration  = false
  tags = {
    Environment = var.environment
    App         = var.app
  }
}
