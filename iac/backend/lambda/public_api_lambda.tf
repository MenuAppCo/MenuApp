resource "aws_lambda_function" "public_api_lambda" {
  function_name = "public-api-lambda"
  role          = var.iam.roles.public_api_lambda.arn
  timeout       = 30
  memory_size   = 256
  architectures = ["x86_64"]
  package_type  = "Image"
  image_uri     = "${var.ecr.public_api_lambda_ecr_url}:${var.public_api_lambda_image_tag}"

  environment {
    variables = {
      SERVICE_NAME = "public-api-lambda"
      DATABASE_URL = var.database_url
      FRONTEND_URL = var.frontend_url
    }
  }

  tags = {
    Environment = var.environment
    App         = var.app
  }
}

resource "aws_cloudwatch_log_group" "public_api_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.public_api_lambda.function_name}"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    App         = var.app
  }
}
