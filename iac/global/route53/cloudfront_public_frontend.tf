data "terraform_remote_state" "cloudfront_lead_pages" {
  backend = "s3"
  config = {
    bucket = "terraformstatetipiing"
    key    = "leads/landing-pages-dashboard/env/project.tfstate"
    region = "us-east-1"
  }
}
