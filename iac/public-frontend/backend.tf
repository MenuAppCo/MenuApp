terraform {
  backend "s3" {
    bucket         = "terraform-state-menapp-production" # manually created
    key            = "public-frontend/project.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks" # manually created
  }
}
