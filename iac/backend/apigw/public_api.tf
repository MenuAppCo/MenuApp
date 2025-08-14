data "template_file" "public_api_openapi_rendered" {
  template = file("${path.root}/../../backend/apps/public-api/openapi.yml.tl")

  vars = {
    lambda_uri = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${var.lambdas.public_api_lambda.arn}/invocations"
  }
}

resource "aws_api_gateway_rest_api" "public_api" {
  name = local.public_api_name
  body = data.template_file.public_api_openapi_rendered.rendered

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "public_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.public_api.id
  triggers = {
    redeploy = sha1(data.template_file.public_api_openapi_rendered.rendered)
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_api_gateway_rest_api.public_api]
}

resource "aws_api_gateway_stage" "public_api_production" {
  stage_name    = "admin-api-${var.environment}"
  rest_api_id   = aws_api_gateway_rest_api.public_api.id
  deployment_id = aws_api_gateway_deployment.public_api_deployment.id
}

resource "aws_lambda_permission" "api_gw_public_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambdas.public_api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.public_api.execution_arn}/*/*"
}


resource "aws_cloudwatch_log_group" "public_api_logs" {
  name              = "/aws/apigateway/${local.public_api_name}"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    App         = var.app
  }
}

