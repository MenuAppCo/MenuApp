terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}


module "ecr" {
  source      = "./ecr"
  environment = var.environment
  app         = var.app
}


module "iam" {
  source      = "./iam"
  environment = var.environment
  app         = var.app
}

module "lambda" {
  source               = "./lambda"
  environment          = var.environment
  app                  = var.app
  iam                  = module.iam
  database_url         = var.DATABASE_URL
  supabase_url         = var.SUPABASE_URL
  supabase_service_key = var.SUPABASE_SERVICE_KEY
  ecr                  = module.ecr

  admin_api_lambda_image_tag = var.ADMIN_BACKEND_IMAGE_TAG
}


module "apigw" {
  source      = "./apigw"
  environment = var.environment
  app         = var.app
  lambdas     = module.lambda

  menapp_certificate_arn = data.terraform_remote_state.route53.outputs.menapp_certificate_validation.certificate_arn
}
