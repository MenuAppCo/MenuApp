data "terraform_remote_state" "cloudfront_admin_frontend" {
  backend = "s3"
  config = {
    bucket = "terraform-state-menapp-production"
    key    = "admin-frontend/project.tfstate"
    region = "us-east-1"
  }
}
