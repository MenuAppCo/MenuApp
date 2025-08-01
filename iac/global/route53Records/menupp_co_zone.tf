resource "aws_route53_record" "menapp_apex_wildcard" {
  zone_id = data.terraform_remote_state.route53.outputs.menapp_zone.zone_id
  name    = "*.menapp.co"
  type    = "A"

  alias {
    name                   = data.terraform_remote_state.cloudfront_public_frontend.outputs.cdn.domain_name
    zone_id                = data.terraform_remote_state.cloudfront_public_frontend.outputs.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "menapp_apex_admin" {
  zone_id = data.terraform_remote_state.route53.outputs.menapp_zone.zone_id
  name    = "admin.menapp.co"
  type    = "A"

  alias {
    name                   = data.terraform_remote_state.cloudfront_admin_frontend.outputs.cdn.domain_name
    zone_id                = data.terraform_remote_state.cloudfront_admin_frontend.outputs.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}
