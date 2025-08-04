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
  s3           = data.terraform_remote_state.global_s3.outputs
  database_url = var.DATABASE_URL #
}

