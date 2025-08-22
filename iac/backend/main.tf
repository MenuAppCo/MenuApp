locals {
  aws_region = "us-east-1"
}


terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = local.aws_region
}


module "ecr" {
  source      = "./ecr"
  environment = var.environment
  app         = var.app
}


module "iam" {
  source         = "./iam"
  environment    = var.environment
  app            = var.app
  s3_bucket_name = var.s3_bucket_name
}

module "lambda" {
  source                      = "./lambda"
  environment                 = var.environment
  app                         = var.app
  iam                         = module.iam
  database_url                = var.DATABASE_URL
  supabase_url                = var.SUPABASE_URL
  supabase_service_key        = var.SUPABASE_SERVICE_KEY
  ecr                         = module.ecr
  admin_frontend_url          = var.ADMIN_FRONTEND_URL
  public_frontend_url         = var.PUBLIC_FRONTEND_URL
  admin_api_lambda_image_tag  = var.ADMIN_BACKEND_IMAGE_TAG
  public_api_lambda_image_tag = var.PUBLIC_BACKEND_IMAGE_TAG
  s3_images_bucket_name       = module.s3.images_bucket_name
}


module "apigw" {
  source      = "./apigw"
  environment = var.environment
  app         = var.app
  lambdas     = module.lambda

  menapp_certificate_arn = data.terraform_remote_state.route53.outputs.menapp_certificate_validation.certificate_arn
}

module "s3" {
  source      = "./s3"
  environment = var.environment
  app         = var.app
}

module "cloudfront" {
  source                               = "./cloudfront"
  environment                          = var.environment
  app                                  = var.app
  s3_media_bucket_regional_domain_name = module.s3.images_bucket_regional_domain_name
  s3_media_bucket_id                   = module.s3.images_bucket_id
  menapp_certificate_arn               = data.terraform_remote_state.route53.outputs.menapp_certificate_validation.certificate_arn
}
