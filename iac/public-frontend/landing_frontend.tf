data "terraform_remote_state" "landing_frontend" {
  backend = "s3"
  config = {
    bucket = "terraform-state-menapp-production"
    key    = "landing-frontend/project.tfstate"
    region = "us-east-1"
  }
}
