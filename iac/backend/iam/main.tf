module "policies" {
  source = "./policies"

  environment = var.environment
  app         = var.app
}

module "roles" {
  source = "./roles"

  environment = var.environment
  app         = var.app
  policies    = module.policies
}
