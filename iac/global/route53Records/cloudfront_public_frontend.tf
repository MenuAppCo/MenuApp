data "terraform_remote_state" "cloudfront_public_frontend" {
  backend = "s3"
  config = {
    bucket = "terraform-state-menapp-production"
    key    = "public-frontend/project.tfstate"
    region = "us-east-1"
  }
}
