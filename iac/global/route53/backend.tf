terraform {
  backend "s3" {
    bucket         = "terraform-state-menapp-production" # manually created
    key            = "route53/project.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks" # manually created
  }
}
