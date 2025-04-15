package com.wiltech.hr.employee.service;

import com.wiltech.hr.employee.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeService {
    
    List<EmployeeDTO> getAllEmployees();
    
    EmployeeDTO getEmployeeById(Long id);
    
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);
    
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);
    
    void deleteEmployee(Long id);
    
    List<EmployeeDTO> getEmployeesByDepartment(String department);
    
    List<EmployeeDTO> getEmployeesByJobTitle(String jobTitle);
} 