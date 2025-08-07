terraform {
  backend "s3" {
    bucket         = "terraform-state-menapp-production"
    key            = "restaurants-frontend/project.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}
