## LOGIN

POST https://api.escuelajs.co/api/v1/auth/login
Content-Type: application/json

{
"email": "john@mail.com",
"password": "changeme"
}

response success:
{
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOCwiZXhwIjoxNjc0NDk0MDI4fQ.kCak9sLJr74frSRVQp0_27BY4iBCgQSmoT3vQVWKzJg",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOCwiZXhwIjoxNjcyODAyMDI4fQ.P1_rB3hJ5afwiG4TWXLq6jOAcVJkvQZ2Z-ZZOnQ1dZw"
}

## GET PROFILE

GET https://api.escuelajs.co/api/v1/auth/profile
Authorization: Bearer {your_access_token}

response success:
{
"id": 1,
"email": "john@mail.com",
"password": "changeme",
"name": "Jhon",
"role": "customer",
"avatar": "https://api.lorem.space/image/face?w=640&h=480&r=867"
}

## REFRESH ACCESS TOKEN

POST https://api.escuelajs.co/api/v1/auth/refresh-token
Content-Type: application/json

body:
{
"refreshToken": "{your_refresh_token}"
}

response success:
{
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOCwiZXhwIjoxNjc0NDk0MDI4fQ.kCak9sLJr74frSRVQp0_27BY4iBCgQSmoT3vQVWKzJg",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOCwiZXhwIjoxNjcyODAyMDI4fQ.P1_rB3hJ5afwiG4TWXLq6jOAcVJkvQZ2Z-ZZOnQ1dZw"
}

## ERROR HANDLING

401 Unauthorized: Invalid credentials or expired tokens
403 Forbidden: Valid authentication but insufficient permissions
400 Bad Request: Malformed request body or headers
