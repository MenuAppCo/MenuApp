resource "aws_lambda_function" "admin_api_lambda" {
  function_name = "admin-api-lambda"
  role          = var.iam.roles.admin_api_lambda.arn
  timeout       = 30
  memory_size   = 256
  architectures = ["x86_64"]
  package_type  = "Image"
  image_uri     = "${var.ecr.admin_api_lambda_ecr_url}:${var.admin_api_lambda_image_tag}"

  environment {
    variables = {
      SERVICE_NAME         = "admin-api-lambda"
      DATABASE_URL         = var.database_url
      SUPABASE_URL         = var.supabase_url
      SUPABASE_SERVICE_KEY = var.supabase_service_key
      ADMIN_FRONTEND_URL   = var.admin_frontend_url
    }
  }

  tags = {
    Environment = var.environment
    App         = var.app
  }
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.admin_api_lambda.function_name}"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    App         = var.app
  }
}
