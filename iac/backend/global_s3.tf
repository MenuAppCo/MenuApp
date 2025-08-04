data "terraform_remote_state" "global_s3" {
  backend = "s3"
  config = {
    bucket = "terraform-state-menapp-production"
    key    = "s3/project.tfstate"
    region = "us-east-1"
  }
}
