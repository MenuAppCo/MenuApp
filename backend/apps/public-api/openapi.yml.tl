openapi: 3.0.1
info:
  title: Public API 
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

  /api/v1/public/restaurant/{slug}:
    options:
      summary: CORS preflight for restaurant info
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
      summary: Get restaurant information
      operationId: getRestaurantInfo
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Restaurant information
        '404':
          description: Restaurant not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/public/restaurant/{slug}/menus:
    options:
      summary: CORS preflight for restaurant menus
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
      summary: Get restaurant menus
      operationId: getRestaurantMenus
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Restaurant menus
        '404':
          description: Restaurant not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/public/menu/{slug}/{menuType}:
    options:
      summary: CORS preflight for public menu
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
      summary: Get public menu
      operationId: getPublicMenu
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
        - name: menuType
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Public menu
        '404':
          description: Menu not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

components: {}
