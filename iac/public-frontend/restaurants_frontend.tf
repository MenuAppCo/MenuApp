data "terraform_remote_state" "restaurants_frontend" {
  backend = "s3"
  config = {
    bucket = "terraform-state-menapp-production"
    key    = "restaurants-frontend/project.tfstate"
    region = "us-east-1"
  }
}
