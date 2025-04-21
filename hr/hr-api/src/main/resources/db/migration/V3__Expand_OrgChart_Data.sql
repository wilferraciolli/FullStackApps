-- Add more departments
INSERT INTO departments (name, description, parent_department_id) VALUES
('Research & Development', 'Innovation and Research', 2),
('Quality Assurance', 'Testing and Quality Control', 2),
('Frontend Development', 'UI/UX and Client-side Development', 2),
('Backend Development', 'Server-side and API Development', 2),
('DevOps', 'Development Operations and Infrastructure', 2),
('Data Science', 'Analytics and Machine Learning', 2),
('Recruitment', 'Talent Acquisition and Onboarding', 3),
('Employee Relations', 'Internal Relations and Culture', 3),
('Compensation & Benefits', 'Salary and Benefits Management', 3),
('Training & Development', 'Employee Training Programs', 3),
('Enterprise Sales', 'Large Business and Corporate Sales', 4),
('SMB Sales', 'Small and Medium Business Sales', 4),
('Inside Sales', 'Remote and Internal Sales', 4),
('Sales Operations', 'Sales Support and Administration', 4),
('Product Design', 'UX/UI Design', 5),
('Product Strategy', 'Product Vision and Roadmap', 5),
('Marketing', 'Marketing and Brand Management', 1),
('Finance', 'Finance and Accounting', 1),
('Legal', 'Legal and Compliance', 1),
('Customer Support', 'Customer Service and Technical Support', 1);

-- Add more employees
INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_title, salary, department)
VALUES 
-- Engineering Team
('Robert', 'Wilson', 'robert.wilson@example.com', '555-111-2222', '2021-05-15', 'VP of Engineering', 150000.00, 'Engineering'),
('Sarah', 'Johnson', 'sarah.johnson@example.com', '555-222-3333', '2021-06-10', 'Frontend Lead', 115000.00, 'Engineering'),
('David', 'Brown', 'david.brown@example.com', '555-333-4444', '2021-07-05', 'Backend Lead', 115000.00, 'Engineering'),
('Emma', 'Davis', 'emma.davis@example.com', '555-444-5555', '2021-08-12', 'DevOps Engineer', 105000.00, 'Engineering'),
('James', 'Miller', 'james.miller@example.com', '555-555-6666', '2021-09-20', 'QA Manager', 110000.00, 'Engineering'),
('Linda', 'Wilson', 'linda.wilson@example.com', '555-666-7777', '2021-10-15', 'Senior Developer', 100000.00, 'Engineering'),
('Thomas', 'Moore', 'thomas.moore@example.com', '555-777-8888', '2021-11-05', 'Data Scientist', 108000.00, 'Engineering'),
('Jennifer', 'Taylor', 'jennifer.taylor@example.com', '555-888-9999', '2021-12-10', 'UX Designer', 95000.00, 'Engineering'),
('William', 'Anderson', 'william.anderson@example.com', '555-999-0000', '2022-01-20', 'Frontend Developer', 90000.00, 'Engineering'),
('Patricia', 'Thomas', 'patricia.thomas@example.com', '555-000-1111', '2022-02-15', 'Backend Developer', 90000.00, 'Engineering'),
('George', 'Jackson', 'george.jackson@example.com', '555-111-0000', '2022-03-10', 'Mobile Developer', 95000.00, 'Engineering'),
('Elizabeth', 'White', 'elizabeth.white@example.com', '555-222-1111', '2022-04-05', 'QA Engineer', 85000.00, 'Engineering'),

-- HR Team
('Richard', 'Harris', 'richard.harris@example.com', '555-333-2222', '2021-05-20', 'Recruitment Manager', 95000.00, 'Human Resources'),
('Barbara', 'Clark', 'barbara.clark@example.com', '555-444-3333', '2021-06-15', 'HR Specialist', 75000.00, 'Human Resources'),
('Michael', 'Lewis', 'michael.lewis@example.com', '555-555-4444', '2021-07-10', 'Compensation Analyst', 80000.00, 'Human Resources'),
('Susan', 'Lee', 'susan.lee@example.com', '555-666-5555', '2021-08-05', 'Training Coordinator', 70000.00, 'Human Resources'),
('Joseph', 'Walker', 'joseph.walker@example.com', '555-777-6666', '2021-09-15', 'Recruiter', 68000.00, 'Human Resources'),

-- Sales Team
('Nancy', 'Hall', 'nancy.hall@example.com', '555-888-7777', '2021-05-25', 'VP of Sales', 145000.00, 'Sales'),
('Charles', 'Allen', 'charles.allen@example.com', '555-999-8888', '2021-06-20', 'Enterprise Sales Director', 125000.00, 'Sales'),
('Margaret', 'Young', 'margaret.young@example.com', '555-000-9999', '2021-07-15', 'SMB Sales Manager', 110000.00, 'Sales'),
('Christopher', 'Green', 'christopher.green@example.com', '555-111-0000', '2021-08-10', 'Sales Operations Manager', 100000.00, 'Sales'),
('Jessica', 'Baker', 'jessica.baker@example.com', '555-222-0000', '2021-09-05', 'Enterprise Account Executive', 95000.00, 'Sales'),
('Daniel', 'Nelson', 'daniel.nelson@example.com', '555-333-1111', '2021-10-20', 'SMB Account Executive', 85000.00, 'Sales'),
('Laura', 'Carter', 'laura.carter@example.com', '555-444-2222', '2021-11-15', 'Inside Sales Rep', 65000.00, 'Sales'),
('Matthew', 'Mitchell', 'matthew.mitchell@example.com', '555-555-3333', '2021-12-05', 'Inside Sales Rep', 65000.00, 'Sales'),

-- Product Team
('Sandra', 'Perez', 'sandra.perez@example.com', '555-666-4444', '2021-05-30', 'VP of Product', 140000.00, 'Product'),
('Kenneth', 'Roberts', 'kenneth.roberts@example.com', '555-777-5555', '2021-06-25', 'Senior Product Manager', 120000.00, 'Product'),
('Ashley', 'Cook', 'ashley.cook@example.com', '555-888-6666', '2021-07-20', 'Product Manager', 100000.00, 'Product'),
('Steven', 'Morgan', 'steven.morgan@example.com', '555-999-7777', '2021-08-15', 'UX Research Lead', 95000.00, 'Product'),
('Kimberly', 'Bell', 'kimberly.bell@example.com', '555-000-8888', '2021-09-10', 'Product Designer', 90000.00, 'Product'),

-- Marketing Team
('Andrew', 'Murphy', 'andrew.murphy@example.com', '555-111-9999', '2021-06-01', 'Marketing Director', 130000.00, 'Marketing'),
('Donna', 'Bailey', 'donna.bailey@example.com', '555-222-0000', '2021-07-01', 'Marketing Manager', 95000.00, 'Marketing'),
('Joshua', 'Rivera', 'joshua.rivera@example.com', '555-333-1111', '2021-08-01', 'Digital Marketing Specialist', 80000.00, 'Marketing'),
('Carol', 'Cox', 'carol.cox@example.com', '555-444-2222', '2021-09-01', 'Content Writer', 75000.00, 'Marketing'),

-- Finance Team
('Edward', 'Howard', 'edward.howard@example.com', '555-555-3333', '2021-06-05', 'Finance Director', 135000.00, 'Finance'),
('Michelle', 'Ward', 'michelle.ward@example.com', '555-666-4444', '2021-07-05', 'Financial Analyst', 90000.00, 'Finance'),
('Jason', 'Torres', 'jason.torres@example.com', '555-777-5555', '2021-08-05', 'Accountant', 85000.00, 'Finance'),

-- Legal Team
('Cynthia', 'Peterson', 'cynthia.peterson@example.com', '555-888-6666', '2021-06-10', 'Legal Counsel', 140000.00, 'Legal'),
('Kevin', 'Gray', 'kevin.gray@example.com', '555-999-7777', '2021-07-10', 'Compliance Officer', 95000.00, 'Legal'),

-- Customer Support Team
('Helen', 'Ramirez', 'helen.ramirez@example.com', '555-000-8888', '2021-06-15', 'Customer Support Manager', 90000.00, 'Customer Support'),
('Timothy', 'James', 'timothy.james@example.com', '555-111-9999', '2021-07-15', 'Senior Support Specialist', 70000.00, 'Customer Support'),
('Olivia', 'Watson', 'olivia.watson@example.com', '555-222-0000', '2021-08-15', 'Support Specialist', 60000.00, 'Customer Support'),
('Brian', 'Brooks', 'brian.brooks@example.com', '555-333-1111', '2021-09-15', 'Support Specialist', 60000.00, 'Customer Support');

-- Update the managers for new departments
UPDATE departments SET manager_id = 4 WHERE id = 6;  -- R&D under Robert Wilson (VP Engineering)
UPDATE departments SET manager_id = 8 WHERE id = 7;  -- QA under James Miller (QA Manager)
UPDATE departments SET manager_id = 5 WHERE id = 8;  -- Frontend under Sarah Johnson (Frontend Lead)
UPDATE departments SET manager_id = 6 WHERE id = 9;  -- Backend under David Brown (Backend Lead)
UPDATE departments SET manager_id = 7 WHERE id = 10; -- DevOps under Emma Davis (DevOps Engineer)
UPDATE departments SET manager_id = 10 WHERE id = 11; -- Data Science under Thomas Moore (Data Scientist)
UPDATE departments SET manager_id = 16 WHERE id = 12; -- Recruitment under Richard Harris (Recruitment Manager)
UPDATE departments SET manager_id = 2 WHERE id = 13; -- Employee Relations under Jane Smith (HR Manager)
UPDATE departments SET manager_id = 18 WHERE id = 14; -- Comp & Benefits under Michael Lewis (Compensation Analyst)
UPDATE departments SET manager_id = 19 WHERE id = 15; -- Training under Susan Lee (Training Coordinator)
UPDATE departments SET manager_id = 22 WHERE id = 16; -- Enterprise Sales under Charles Allen (Enterprise Sales Director)
UPDATE departments SET manager_id = 23 WHERE id = 17; -- SMB Sales under Margaret Young (SMB Sales Manager)
UPDATE departments SET manager_id = 3 WHERE id = 18; -- Inside Sales under Michael Johnson (Sales Representative)
UPDATE departments SET manager_id = 24 WHERE id = 19; -- Sales Ops under Christopher Green (Sales Operations Manager)
UPDATE departments SET manager_id = 31 WHERE id = 20; -- Product Design under Steven Morgan (UX Research Lead)
UPDATE departments SET manager_id = 29 WHERE id = 21; -- Product Strategy under Kenneth Roberts (Senior Product Manager)
UPDATE departments SET manager_id = 33 WHERE id = 22; -- Marketing under Donna Bailey (Marketing Manager)
UPDATE departments SET manager_id = 36 WHERE id = 23; -- Finance under Michelle Ward (Financial Analyst)
UPDATE departments SET manager_id = 38 WHERE id = 24; -- Legal under Kevin Gray (Compliance Officer)
UPDATE departments SET manager_id = 40 WHERE id = 25; -- Customer Support under Timothy James (Senior Support Specialist)

-- Setup employee hierarchy (many entries to build full org chart)

-- Executive Team reporting to CEO
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(4, 1, 2, 2),   -- Robert Wilson (VP Engineering) reports to CEO
(21, 1, 4, 2),  -- Nancy Hall (VP Sales) reports to CEO
(26, 1, 5, 2),  -- Sandra Perez (VP Product) reports to CEO
(30, 1, 22, 2), -- Andrew Murphy (Marketing Director) reports to CEO
(34, 1, 23, 2), -- Edward Howard (Finance Director) reports to CEO
(37, 1, 24, 2), -- Cynthia Peterson (Legal Counsel) reports to CEO
(39, 1, 25, 2); -- Helen Ramirez (Customer Support Manager) reports to CEO

-- Engineering Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(5, 4, 8, 3),    -- Sarah Johnson (Frontend Lead) reports to VP Engineering
(6, 4, 9, 3),    -- David Brown (Backend Lead) reports to VP Engineering
(7, 4, 10, 3),   -- Emma Davis (DevOps) reports to VP Engineering
(8, 4, 7, 3),    -- James Miller (QA Manager) reports to VP Engineering
(9, 5, 8, 4),    -- Linda Wilson (Senior Developer) reports to Frontend Lead
(10, 4, 11, 3),  -- Thomas Moore (Data Scientist) reports to VP Engineering
(11, 5, 8, 4),   -- Jennifer Taylor (UX Designer) reports to Frontend Lead
(12, 5, 8, 4),   -- William Anderson (Frontend Developer) reports to Frontend Lead
(13, 6, 9, 4),   -- Patricia Thomas (Backend Developer) reports to Backend Lead
(14, 5, 8, 4),   -- George Jackson (Mobile Developer) reports to Frontend Lead
(15, 8, 7, 4);   -- Elizabeth White (QA Engineer) reports to QA Manager

-- HR Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(16, 2, 12, 3),  -- Richard Harris (Recruitment Manager) reports to HR Manager
(17, 2, 13, 3),  -- Barbara Clark (HR Specialist) reports to HR Manager
(18, 2, 14, 3),  -- Michael Lewis (Compensation Analyst) reports to HR Manager
(19, 2, 15, 3),  -- Susan Lee (Training Coordinator) reports to HR Manager
(20, 16, 12, 4); -- Joseph Walker (Recruiter) reports to Recruitment Manager

-- Sales Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(22, 21, 16, 3),  -- Charles Allen (Enterprise Sales Director) reports to VP Sales
(23, 21, 17, 3),  -- Margaret Young (SMB Sales Manager) reports to VP Sales
(24, 21, 19, 3),  -- Christopher Green (Sales Operations Manager) reports to VP Sales
(25, 22, 16, 4),  -- Jessica Baker (Enterprise Account Exec) reports to Enterprise Sales Director
(3, 21, 18, 3),   -- Michael Johnson (Sales Representative) reports to VP Sales
(26, 23, 17, 4),  -- Daniel Nelson (SMB Account Exec) reports to SMB Sales Manager
(27, 3, 18, 4),   -- Laura Carter (Inside Sales Rep) reports to Michael Johnson
(28, 3, 18, 4);   -- Matthew Mitchell (Inside Sales Rep) reports to Michael Johnson

-- Product Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(29, 26, 21, 3),  -- Kenneth Roberts (Senior Product Manager) reports to VP Product
(30, 26, 5, 3),   -- Ashley Cook (Product Manager) reports to VP Product
(31, 26, 20, 3),  -- Steven Morgan (UX Research Lead) reports to VP Product
(32, 31, 20, 4);  -- Kimberly Bell (Product Designer) reports to UX Research Lead

-- Marketing Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(33, 30, 22, 3), -- Donna Bailey (Marketing Manager) reports to Marketing Director
(34, 33, 22, 4), -- Joshua Rivera (Digital Marketing Specialist) reports to Marketing Manager
(35, 33, 22, 4); -- Carol Cox (Content Writer) reports to Marketing Manager

-- Finance Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(36, 34, 23, 3), -- Michelle Ward (Financial Analyst) reports to Finance Director
(37, 34, 23, 3); -- Jason Torres (Accountant) reports to Finance Director

-- Legal Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(38, 37, 24, 3); -- Kevin Gray (Compliance Officer) reports to Legal Counsel

-- Customer Support Department
INSERT INTO employee_hierarchy (employee_id, manager_id, department_id, position_level) VALUES
(40, 39, 25, 3), -- Timothy James (Senior Support Specialist) reports to Customer Support Manager
(41, 39, 25, 3), -- Olivia Watson (Support Specialist) reports to Customer Support Manager
(42, 39, 25, 3); -- Brian Brooks (Support Specialist) reports to Customer Support Manager 