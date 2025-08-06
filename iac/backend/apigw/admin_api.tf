data "template_file" "admin_openapi_rendered" {
  template = file("${path.root}/../../backend/openapi.yml.tl")

  vars = {
    lambda_uri = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${var.lambdas.admin_api_lambda.arn}/invocations"
  }
}

resource "aws_api_gateway_rest_api" "admin_api" {
  name = local.admin_api_name
  body = data.template_file.admin_openapi_rendered.rendered

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "admin_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.admin_api.id
  triggers = {
    redeploy = sha1(data.template_file.admin_openapi_rendered.rendered)
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_api_gateway_rest_api.admin_api]
}

resource "aws_api_gateway_stage" "admin_api_production" {
  stage_name    = "admin-api-${var.environment}"
  rest_api_id   = aws_api_gateway_rest_api.admin_api.id
  deployment_id = aws_api_gateway_deployment.admin_api_deployment.id
}

resource "aws_lambda_permission" "api_gw_admin_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambdas.admin_api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.admin_api.execution_arn}/*/*"
}


resource "aws_cloudwatch_log_group" "admin_api_logs" {
  name              = "/aws/apigateway/${local.admin_api_name}"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    App         = var.app
  }
}

resource "aws_api_gateway_domain_name" "admin_api_domain" {
  domain_name = local.admin_domain_name

  regional_certificate_arn = var.menapp_certificate_arn
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "admin_api_mapping" {
  api_id      = aws_api_gateway_rest_api.admin_api.id
  stage_name  = aws_api_gateway_stage.admin_api_production.stage_name
  domain_name = aws_api_gateway_domain_name.admin_api_domain.domain_name

  depends_on = [aws_api_gateway_stage.admin_api_production]
}
