data "terraform_remote_state" "route53" {
  backend = "s3"
  config = {
    bucket = "terraform-state-menapp-production"
    key    = "route53/project.tfstate"
    region = "us-east-1"
  }
}
