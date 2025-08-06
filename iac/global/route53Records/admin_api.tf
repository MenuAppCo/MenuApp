data "terraform_remote_state" "admin_api" {
  backend = "s3"
  config = {
    bucket = "terraform-state-menapp-production"
    key    = "backend/project.tfstate"
    region = "us-east-1"
  }
}
