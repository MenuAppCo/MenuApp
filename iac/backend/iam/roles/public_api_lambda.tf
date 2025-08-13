resource "aws_iam_role" "public_api_lambda" {
  name = "public-api-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    App         = var.app
  }
}


resource "aws_iam_role_policy_attachment" "attach_public_api_lambda_policy" {
  role       = aws_iam_role.public_api_lambda.name
  policy_arn = var.policies.public_api_lambda.arn
}