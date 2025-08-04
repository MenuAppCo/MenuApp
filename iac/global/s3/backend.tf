terraform {
  backend "s3" {
    bucket         = "terraform-state-menapp-production"
    key            = "s3/project.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}
