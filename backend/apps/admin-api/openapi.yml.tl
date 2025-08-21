openapi: 3.0.1
info:
  title: Admin API 
  description: Template-based OpenAPI for API Gateway & Lambda
  version: "1.0"

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []

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

  /api/v1/restaurants/initialize:
    options:
      summary: CORS preflight for restaurant initialization
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
              method.response.header.Access-Control-Allow-Methods: "'POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    post:
      summary: Initialize restaurant
      operationId: initializeRestaurant
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Restaurant initialized
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/restaurants/me:
    options:
      summary: CORS preflight for my restaurant
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
              method.response.header.Access-Control-Allow-Methods: "'GET,PUT,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get my restaurant
      operationId: getMyRestaurant
      security:
        - bearerAuth: []
      responses:
        '200':
          description: My restaurant details
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    put:
      summary: Update my restaurant
      operationId: updateMyRestaurant
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Restaurant updated
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/restaurants/me/settings:
    options:
      summary: CORS preflight for restaurant settings
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
              method.response.header.Access-Control-Allow-Methods: "'GET,PUT,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get my restaurant settings
      operationId: getMySettings
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Restaurant settings
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    put:
      summary: Update my restaurant settings
      operationId: updateMySettings
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Settings updated
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/restaurants/me/social-media:
    options:
      summary: CORS preflight for restaurant social media
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
              method.response.header.Access-Control-Allow-Methods: "'GET,PUT,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get my restaurant social media
      operationId: getMySocialMedia
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Restaurant social media
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    put:
      summary: Update my restaurant social media
      operationId: updateMySocialMedia
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Social media updated
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/menus:
    options:
      summary: CORS preflight for menus
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
              method.response.header.Access-Control-Allow-Methods: "'GET,POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get all menus
      operationId: getMenus
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of menus
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    post:
      summary: Create new menu
      operationId: createMenu
      security:
        - bearerAuth: []
      responses:
        '201':
          description: Menu created
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/menus/reorder:
    options:
      summary: CORS preflight for menu reorder
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
              method.response.header.Access-Control-Allow-Methods: "'PUT,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    put:
      summary: Reorder menus
      operationId: reorderMenus
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Menus reordered
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/menus/{menuId}:
    options:
      summary: CORS preflight for menu by ID
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
              method.response.header.Access-Control-Allow-Methods: "'GET,PUT,DELETE,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get menu by ID
      operationId: getMenu
      security:
        - bearerAuth: []
      parameters:
        - name: menuId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Menu details
        '401':
          description: Unauthorized
        '404':
          description: Menu not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    put:
      summary: Update menu by ID
      operationId: updateMenu
      security:
        - bearerAuth: []
      parameters:
        - name: menuId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Menu updated
        '401':
          description: Unauthorized
        '404':
          description: Menu not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    delete:
      summary: Delete menu by ID
      operationId: deleteMenu
      security:
        - bearerAuth: []
      parameters:
        - name: menuId
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Menu deleted
        '401':
          description: Unauthorized
        '404':
          description: Menu not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/categories:
    options:
      summary: CORS preflight for categories
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
              method.response.header.Access-Control-Allow-Methods: "'GET,POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get all categories
      operationId: getCategories
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of categories
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    post:
      summary: Create new category
      operationId: createCategory
      security:
        - bearerAuth: []
      responses:
        '201':
          description: Category created
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/categories/reorder:
    options:
      summary: CORS preflight for category reorder
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
              method.response.header.Access-Control-Allow-Methods: "'PUT,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    put:
      summary: Reorder categories
      operationId: reorderCategories
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Categories reordered
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/categories/{id}:
    options:
      summary: CORS preflight for category by ID
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
              method.response.header.Access-Control-Allow-Methods: "'GET,PUT,DELETE,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get category by ID
      operationId: getCategory
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Category details
        '401':
          description: Unauthorized
        '404':
          description: Category not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    put:
      summary: Update category by ID
      operationId: updateCategory
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Category updated
        '401':
          description: Unauthorized
        '404':
          description: Category not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    delete:
      summary: Delete category by ID
      operationId: deleteCategory
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Category deleted
        '401':
          description: Unauthorized
        '404':
          description: Category not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/products:
    options:
      summary: CORS preflight for products
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
              method.response.header.Access-Control-Allow-Methods: "'GET,POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get all products
      operationId: getProducts
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of products
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    post:
      summary: Create new product
      operationId: createProduct
      security:
        - bearerAuth: []
      responses:
        '201':
          description: Product created
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/products/{id}:
    options:
      summary: CORS preflight for product by ID
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
              method.response.header.Access-Control-Allow-Methods: "'GET,PUT,DELETE,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get product by ID
      operationId: getProduct
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product details
        '401':
          description: Unauthorized
        '404':
          description: Product not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    put:
      summary: Update product by ID
      operationId: updateProduct
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product updated
        '401':
          description: Unauthorized
        '404':
          description: Product not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    delete:
      summary: Delete product by ID
      operationId: deleteProduct
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Product deleted
        '401':
          description: Unauthorized
        '404':
          description: Product not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/products/{id}/visibility:
    options:
      summary: CORS preflight for product visibility
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
              method.response.header.Access-Control-Allow-Methods: "'PATCH,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    patch:
      summary: Toggle product visibility
      operationId: toggleProductVisibility
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product visibility toggled
        '401':
          description: Unauthorized
        '404':
          description: Product not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/products/{id}/featured:
    options:
      summary: CORS preflight for product featured
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
              method.response.header.Access-Control-Allow-Methods: "'PATCH,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    patch:
      summary: Toggle product featured status
      operationId: toggleProductFeatured
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product featured status toggled
        '401':
          description: Unauthorized
        '404':
          description: Product not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/users/me/profile:
    options:
      summary: CORS preflight for user profile
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
              method.response.header.Access-Control-Allow-Methods: "'GET,POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    get:
      summary: Get my profile
      operationId: getMyProfile
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User profile details
        '401':
          description: Unauthorized
        '404':
          description: Profile not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    post:
      summary: Create my profile
      operationId: createMyProfile
      security:
        - bearerAuth: []
      responses:
        '201':
          description: Profile created
        '400':
          description: Bad request - missing required fields
        '401':
          description: Unauthorized
        '409':
          description: Profile already exists
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/uploads/products/{productId}:
    options:
      summary: CORS preflight for product image uploads
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
              method.response.header.Access-Control-Allow-Methods: "'POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    post:
      summary: Upload product image
      operationId: uploadProductImage
      security:
        - bearerAuth: []
      parameters:
        - name: productId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
      responses:
        '200':
          description: Image uploaded successfully
        '400':
          description: Bad request - invalid image
        '401':
          description: Unauthorized
        '404':
          description: Product not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/uploads/categories/{categoryId}:
    options:
      summary: CORS preflight for category image upload
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
              method.response.header.Access-Control-Allow-Methods: "'POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    post:
      summary: Upload category image
      operationId: uploadCategoryImage
      security:
        - bearerAuth: []
      parameters:
        - name: categoryId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
      responses:
        '200':
          description: Image uploaded successfully
        '400':
          description: Bad request - invalid image
        '401':
          description: Unauthorized
        '404':
          description: Category not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/uploads/restaurant/logo:
    options:
      summary: CORS preflight for restaurant logo upload
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
              method.response.header.Access-Control-Allow-Methods: "'POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    post:
      summary: Upload restaurant logo
      operationId: uploadRestaurantLogo
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
      responses:
        '200':
          description: Logo uploaded successfully
        '400':
          description: Bad request - invalid image
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

    delete:
      summary: Delete restaurant logo
      operationId: deleteRestaurantLogo
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Logo deleted successfully
        '401':
          description: Unauthorized
        '404':
          description: Logo not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

  /api/v1/uploads/{type}/{id}:
    options:
      summary: CORS preflight for image deletion
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
              method.response.header.Access-Control-Allow-Methods: "'DELETE,OPTIONS'"
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            responseTemplates:
              application/json: "{}"

    delete:
      summary: Delete image
      operationId: deleteImage
      security:
        - bearerAuth: []
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
            enum: [products, categories, restaurant]
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Image deleted successfully
        '401':
          description: Unauthorized
        '404':
          description: Image not found
      x-amazon-apigateway-integration:
        uri: "${lambda_uri}"
        httpMethod: POST
        type: aws_proxy
        payloadFormatVersion: "2.0"

components: {}
