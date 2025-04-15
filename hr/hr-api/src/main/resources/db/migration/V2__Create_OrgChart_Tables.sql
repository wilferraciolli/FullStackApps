-- Create the departments table
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    manager_id BIGINT,
    parent_department_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the employee_hierarchy table to represent reporting relationships
CREATE TABLE employee_hierarchy (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    manager_id BIGINT,
    department_id BIGINT NOT NULL,
    position_level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Add foreign key to departments table after both tables are created
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_manager 
FOREIGN KEY (manager_id) REFERENCES employees(id);

ALTER TABLE departments 
ADD CONSTRAINT fk_departments_parent 
FOREIGN KEY (parent_department_id) REFERENCES departments(id);

-- Insert sample departments
INSERT INTO departments (name, description, parent_department_id) VALUES
('Executive', 'Executive Leadership Team', NULL),
('Engineering', 'Software Development and Engineering', 1),
('Human Resources', 'HR Management and Recruitment', 1),
('Sales', 'Sales and Business Development', 1),
('Product', 'Product Management', 2);

-- Update the managers for departments using existing employees
UPDATE departments SET manager_id = 1 WHERE id = 1; -- Executive
UPDATE departments SET manager_id = 1 WHERE id = 2; -- Engineering
UPDATE departments SET manager_id = 2 WHERE id = 3; -- HR
UPDATE departments SET manager_id = 3 WHERE id = 4; -- Sales
UPDATE departments SET manager_id = 1 WHERE id = 5; -- Product

-- Insert sample hierarchy data
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(1, NULL, 1, 1),    -- John Doe (CEO, no manager)
(2, 1, 3, 2),       -- Jane Smith (HR Manager, reports to John)
(3, 1, 4, 2);       -- Michael Johnson (Sales, reports to John) 