#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:8080/api/employees"

# Set text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Testing Employee API ===${NC}"

# GET all employees
echo -e "\n${YELLOW}[GET] Fetching all employees:${NC}"
curl -s -X GET $BASE_URL | json_pp

# GET employee by ID
echo -e "\n${YELLOW}[GET] Fetching employee with ID 1:${NC}"
curl -s -X GET $BASE_URL/1 | json_pp

# GET employees by department
echo -e "\n${YELLOW}[GET] Fetching employees in Engineering department:${NC}"
curl -s -X GET "$BASE_URL/department/Engineering" | json_pp

# GET employees by job title
echo -e "\n${YELLOW}[GET] Fetching Software Developer employees:${NC}"
curl -s -X GET "$BASE_URL/job-title/Software%20Developer" | json_pp

# POST - Create a new employee
echo -e "\n${YELLOW}[POST] Creating a new employee:${NC}"
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Williams",
    "email": "alice.williams@example.com",
    "phoneNumber": "555-789-1234",
    "hireDate": "2023-06-15",
    "jobTitle": "Product Manager",
    "salary": 92000.00,
    "department": "Product"
  }' | json_pp

# PUT - Update employee
echo -e "\n${YELLOW}[PUT] Updating employee with ID 1:${NC}"
curl -s -X PUT $BASE_URL/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "555-123-4567",
    "hireDate": "2022-01-15",
    "jobTitle": "Senior Software Developer",
    "salary": 95000.00,
    "department": "Engineering"
  }' | json_pp

# Verify the update
echo -e "\n${YELLOW}[GET] Verifying update of employee with ID 1:${NC}"
curl -s -X GET $BASE_URL/1 | json_pp

# DELETE - Delete employee (uncomment when ready to test deletion)
# echo -e "\n${YELLOW}[DELETE] Deleting employee with ID 4:${NC}"
# curl -s -X DELETE $BASE_URL/4 -w "\n%{http_code}\n"

echo -e "\n${GREEN}=== API Testing Complete ===${NC}" 