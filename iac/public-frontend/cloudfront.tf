resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  aliases = [
    "menapp.co",
    "www.menapp.co"
  ]

  viewer_certificate {
    acm_certificate_arn      = data.terraform_remote_state.route53.outputs.menapp_certificate_validation.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  origin {
    domain_name              = data.terraform_remote_state.landing_frontend.outputs.frontend_bucket_regional_domain_name
    origin_id                = "s3-${data.terraform_remote_state.landing_frontend.outputs.frontend_bucket_id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.landing_frontend.id
  }

  origin {
    domain_name              = data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_regional_domain_name
    origin_id                = "s3-${data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.restaurants_frontend.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-${data.terraform_remote_state.landing_frontend.outputs.frontend_bucket_id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  ordered_cache_behavior {
    path_pattern           = "/restaurants/*"
    target_origin_id       = "s3-${data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_restaurants_spa.arn
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/restaurants/"
    target_origin_id       = "s3-${data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_restaurants_spa.arn
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/restaurants"
    target_origin_id       = "s3-${data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_restaurants_spa.arn
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = var.environment
    App         = var.app
  }
}

resource "aws_cloudfront_origin_access_control" "landing_frontend" {
  name                              = "s3-${data.terraform_remote_state.landing_frontend.outputs.frontend_bucket_id}-frontend-oac"
  description                       = "Origin Access Control for frontend S3 Bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "restaurants_frontend" {
  name                              = "s3-${data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_id}-frontend-oac"
  description                       = "Origin Access Control for frontend S3 Bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket_policy" "restaurants_frontend_policy" {
  bucket = data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${data.terraform_remote_state.restaurants_frontend.outputs.frontend_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "landing_frontend_policy" {
  bucket = data.terraform_remote_state.landing_frontend.outputs.frontend_bucket_id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${data.terraform_remote_state.landing_frontend.outputs.frontend_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}

resource "aws_cloudfront_function" "rewrite_restaurants_spa" {
  name    = "rewrite-restaurants-spa"
  runtime = "cloudfront-js-1.0"

  code    = <<EOF
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    if (uri.startsWith("/restaurants") && !uri.match(/\\.[a-zA-Z0-9]+$/)) {
        request.uri = "/restaurants/index.html";
    }

    return request;
}
EOF
  publish = true
}