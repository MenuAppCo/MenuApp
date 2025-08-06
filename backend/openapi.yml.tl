openapi: 3.0.1
info:
  title: Admin API
  description: Template-based OpenAPI for API Gateway & Lambda
  version: "1.0"

paths:
  /health:
    options:
      summary: CORS preflight
      responses:
        '200':
          description: CORS OK
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
            Access-Control-Allow-Methods:
              schema:
                type: string
            Access-Control-Allow-Headers:
              schema:
                type: string
      x-amazon-apigateway-integration:
        type: mock
        requestTemplates:
          application/json: |
            {
              "statusCode" : 200
            }
        responses:
          default:
            statusCode: 200
            responseParameters:
              method.response.header.Access-Control-Allow-Origin: "'*'"
              method.response.header.Access-Control-Allow-Methods: "'GET,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Health check
      operationId: health
      responses:
        '200':
          description: OK
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

components: {}
