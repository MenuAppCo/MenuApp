module "policies" {
  source = "./policies"

  environment                  = var.environment
  app                          = var.app
  lambda_deployment_bucket_arn = var.lambda_deployment_bucket_arn
}

module "roles" {
  source = "./roles"

  environment = var.environment
  app         = var.app
  policies    = module.policies
}
