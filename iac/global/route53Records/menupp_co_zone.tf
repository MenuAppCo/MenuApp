resource "aws_route53_record" "menapp_apex" {
  zone_id = data.terraform_remote_state.route53.outputs.menapp_zone.zone_id
  name    = "menapp.co"
  type    = "A"

  alias {
    name                   = data.terraform_remote_state.cloudfront_public_frontend.outputs.cdn.domain_name
    zone_id                = data.terraform_remote_state.cloudfront_public_frontend.outputs.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "menapp_www" {
  zone_id = data.terraform_remote_state.route53.outputs.menapp_zone.zone_id
  name    = "www.menapp.co"
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


resource "aws_route53_record" "menapp_admin_api_apex" {
  zone_id = data.terraform_remote_state.route53.outputs.menapp_zone.zone_id
  name    = "api.menapp.co"
  type    = "A"

  alias {
    name                   = data.terraform_remote_state.admin_api.outputs.admin_api_domain_regional_domain_name
    zone_id                = data.terraform_remote_state.admin_api.outputs.admin_api_domain_regional_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "menapp_public_api_apex" {
  zone_id = data.terraform_remote_state.route53.outputs.menapp_zone.zone_id
  name    = "menu.menapp.co"
  type    = "A"

  alias {
    name                   = data.terraform_remote_state.admin_api.outputs.public_api_domain_regional_domain_name
    zone_id                = data.terraform_remote_state.admin_api.outputs.public_api_domain_regional_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "menapp_media_api_apex" {
  zone_id = data.terraform_remote_state.route53.outputs.menapp_zone.zone_id
  name    = "media.menapp.co"
  type    = "A"

  alias {
    name                   = data.terraform_remote_state.outputs.media_cdn.domain_name
    zone_id                = data.terraform_remote_state.outputs.media_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}