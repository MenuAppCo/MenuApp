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


module "s3" {
  source      = "./s3"
  environment = var.environment
  app         = var.app
}

module "iam" {
  source                       = "./iam"
  environment                  = var.environment
  app                          = var.app
  lambda_deployment_bucket_arn = module.s3.lambda_deployment_bucket_arn
}

module "lambda" {
  source       = "./lambda"
  environment  = var.environment
  app          = var.app
  iam          = module.iam
  s3           = module.s3
  database_url = var.DATABASE_URL #
}

