package com.wiltech.hr.orgchart.service;

import com.wiltech.hr.orgchart.dto.DepartmentDTO;
import com.wiltech.hr.orgchart.dto.EmployeeHierarchyDTO;
import com.wiltech.hr.orgchart.dto.OrgChartNodeDTO;

import java.util.List;

/**
 * Service interface for managing and retrieving organization chart data.
 */
public interface OrgChartService {
    
    /**
     * Retrieves the full organizational chart structure in a format suitable for UI components.
     *
     * @return The root node of the organizational chart
     */
    OrgChartNodeDTO getOrgChart();
    
    /**
     * Retrieves a sub-tree of the organizational chart starting from a specific employee.
     *
     * @param employeeId The ID of the employee to use as the root
     * @return The node representing the specified employee and all their subordinates
     */
    OrgChartNodeDTO getOrgChartByEmployee(Long employeeId);
    
    /**
     * Retrieves a sub-tree of the organizational chart for a specific department.
     *
     * @param departmentId The ID of the department
     * @return The node representing the department's structure
     */
    OrgChartNodeDTO getOrgChartByDepartment(Long departmentId);
    
    /**
     * Gets all departments in a hierarchical structure.
     *
     * @return A list of top-level departments with their children
     */
    List<DepartmentDTO> getDepartmentHierarchy();
    
    /**
     * Gets all employee hierarchy relationships.
     *
     * @return A list of all employee hierarchy relationships
     */
    List<EmployeeHierarchyDTO> getAllEmployeeHierarchies();
    
    /**
     * Creates or updates an employee hierarchy relationship.
     *
     * @param employeeHierarchyDTO The employee hierarchy data
     * @return The updated or created employee hierarchy
     */
    EmployeeHierarchyDTO saveEmployeeHierarchy(EmployeeHierarchyDTO employeeHierarchyDTO);
    
    /**
     * Removes an employee hierarchy relationship.
     *
     * @param id The ID of the hierarchy relationship to remove
     */
    void deleteEmployeeHierarchy(Long id);
} 