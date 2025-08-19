module "policies" {
  source = "./policies"

  environment    = var.environment
  app            = var.app
  s3_bucket_name = var.s3_bucket_name
}

module "roles" {
  source = "./roles"

  environment = var.environment
  app         = var.app
  policies    = module.policies
}
