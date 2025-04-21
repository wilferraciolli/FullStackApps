# Employee API Testing Guide

This guide provides instructions on how to test the Employee and Org Chart REST APIs using various HTTP clients.

## Prerequisites

- The HR application must be running on `http://localhost:8080`
- For the shell script: Bash environment with `curl` and `json_pp` installed

## Available HTTP Clients

### 1. HTTP Request Files (`.http`)

Located at:
- `src/test/http/employee-api.http` - Employee API endpoints
- `src/test/http/orgchart-api.http` - Organization Chart API endpoints

These files can be used with:

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

### Employee API

| Method | Endpoint                        | Description                   |
|--------|--------------------------------|-------------------------------|
| GET    | `/api/employees`               | Get all employees             |
| GET    | `/api/employees/{id}`          | Get employee by ID            |
| GET    | `/api/employees/department/{department}` | Get employees by department |
| GET    | `/api/employees/job-title/{jobTitle}` | Get employees by job title |
| POST   | `/api/employees`               | Create a new employee         |
| PUT    | `/api/employees/{id}`          | Update an existing employee   |
| DELETE | `/api/employees/{id}`          | Delete an employee            |

### Organization Chart API

| Method | Endpoint                        | Description                   |
|--------|--------------------------------|-------------------------------|
| GET    | `/api/org-chart`               | Get full organization chart   |
| GET    | `/api/org-chart/employee/{employeeId}` | Get org chart for specific employee |
| GET    | `/api/org-chart/department/{departmentId}` | Get org chart for specific department |
| GET    | `/api/org-chart/departments`   | Get department hierarchy      |
| GET    | `/api/org-chart/hierarchies`   | Get all employee hierarchies  |
| POST   | `/api/org-chart/hierarchies`   | Create/update employee hierarchy |
| DELETE | `/api/org-chart/hierarchies/{id}` | Delete employee hierarchy  |

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

### Create/Update Employee Hierarchy (POST)

```json
{
  "employeeId": 1,
  "managerId": null,
  "departmentId": 1,
  "positionLevel": 1
}
```

## Response Formats

### OrgChartNodeDTO (Used for UI Components)

```json
{
  "id": "1",
  "name": "John Doe",
  "title": "CEO",
  "department": "Executive",
  "email": "john.doe@example.com",
  "imageUrl": "https://via.placeholder.com/150",
  "children": [
    {
      "id": "2",
      "name": "Jane Smith",
      "title": "HR Manager",
      "department": "Human Resources",
      "email": "jane.smith@example.com",
      "imageUrl": "https://via.placeholder.com/150",
      "children": []
    }
  ]
}
``` 