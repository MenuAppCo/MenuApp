locals {
  menapp_domain_name = "menapp.co"
}

resource "aws_route53_zone" "menapp" {
  name = local.menapp_domain_name

  tags = {
    Environment = var.environment
    App         = var.app
  }
}

resource "aws_route53_record" "menapp_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.menapp.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }

  zone_id         = aws_route53_zone.menapp.zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 300
  records         = [each.value.value]
  allow_overwrite = true
}

resource "aws_acm_certificate" "menapp" {
  domain_name       = local.menapp_domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.menapp.co",
    "api.menapp.co",
    "admin.menapp.co",
    "app.menapp.co",
    "menu.menapp.co"
  ]

  tags = {
    Name = "menapp-cert"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "menapp" {
  certificate_arn         = aws_acm_certificate.menapp.arn
  validation_record_fqdns = [for record in aws_route53_record.menapp_cert_validation : record.fqdn]
}

output "menapp_certificate_validation" {
  value = aws_acm_certificate_validation.menapp
}

output "menapp_zone" {
  value = aws_route53_zone.menapp
}

