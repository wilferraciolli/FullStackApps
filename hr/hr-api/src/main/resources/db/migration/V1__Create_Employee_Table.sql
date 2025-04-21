CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    hire_date DATE NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add some initial sample data
INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_title, salary, department)
VALUES 
    ('John', 'Doe', 'john.doe@example.com', '555-123-4567', '2022-01-15', 'Software Developer', 85000.00, 'Engineering'),
    ('Jane', 'Smith', 'jane.smith@example.com', '555-987-6543', '2021-08-10', 'HR Manager', 75000.00, 'Human Resources'),
    ('Michael', 'Johnson', 'michael.johnson@example.com', '555-456-7890', '2023-03-20', 'Sales Representative', 65000.00, 'Sales'); 