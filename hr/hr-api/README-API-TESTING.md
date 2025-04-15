# Employee API Testing Guide

This guide provides instructions on how to test the Employee REST API using various HTTP clients.

## Prerequisites

- The HR application must be running on `http://localhost:8080`
- For the shell script: Bash environment with `curl` and `json_pp` installed

## Available HTTP Clients

### 1. HTTP Request File (`.http`)

Located at `src/test/http/employee-api.http`, this file can be used with:

- IntelliJ IDEA's HTTP Client
- VS Code with the REST Client extension
- Any other editor that supports `.http` files

Simply open the file and click the "Run" button next to each request.

### 2. Shell Script

A Bash script is available at `scripts/test-api.sh`. To use it:

```bash
# Make the script executable
chmod +x scripts/test-api.sh

# Run the script
./scripts/test-api.sh
```

The script will execute all API tests in sequence and display formatted JSON responses.

### 3. Postman Collection

A Postman collection is available at `postman/Employee_API.postman_collection.json`. To use it:

1. Open Postman
2. Click "Import" and select the JSON file
3. The collection will be imported with all prepared requests
4. Run individual requests or use the Collection Runner to run all tests

## API Endpoints

| Method | Endpoint                        | Description                   |
|--------|--------------------------------|-------------------------------|
| GET    | `/api/employees`               | Get all employees             |
| GET    | `/api/employees/{id}`          | Get employee by ID            |
| GET    | `/api/employees/department/{department}` | Get employees by department |
| GET    | `/api/employees/job-title/{jobTitle}` | Get employees by job title |
| POST   | `/api/employees`               | Create a new employee         |
| PUT    | `/api/employees/{id}`          | Update an existing employee   |
| DELETE | `/api/employees/{id}`          | Delete an employee            |

## Example Payloads

### Create/Update Employee (POST/PUT)

```json
{
  "firstName": "Alice",
  "lastName": "Williams",
  "email": "alice.williams@example.com",
  "phoneNumber": "555-789-1234",
  "hireDate": "2023-06-15",
  "jobTitle": "Product Manager",
  "salary": 92000.00,
  "department": "Product"
}
``` 