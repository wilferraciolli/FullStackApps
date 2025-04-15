package com.wiltech.hr.orgchart.controller;

import com.wiltech.hr.orgchart.dto.DepartmentDTO;
import com.wiltech.hr.orgchart.dto.EmployeeHierarchyDTO;
import com.wiltech.hr.orgchart.dto.OrgChartNodeDTO;
import com.wiltech.hr.orgchart.service.OrgChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/org-chart")
@CrossOrigin(origins = "*")
public class OrgChartController {

    private final OrgChartService orgChartService;

    @Autowired
    public OrgChartController(OrgChartService orgChartService) {
        this.orgChartService = orgChartService;
    }

    /**
     * Get the complete organization chart.
     *
     * @return The full org chart structure
     */
    @GetMapping
    public ResponseEntity<OrgChartNodeDTO> getOrgChart() {
        OrgChartNodeDTO orgChart = orgChartService.getOrgChart();
        return ResponseEntity.ok(orgChart);
    }

    /**
     * Get the org chart starting from a specific employee.
     *
     * @param employeeId The ID of the employee to use as the root
     * @return The org chart for the specified employee and their subordinates
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<OrgChartNodeDTO> getOrgChartByEmployee(@PathVariable Long employeeId) {
        OrgChartNodeDTO orgChart = orgChartService.getOrgChartByEmployee(employeeId);
        return ResponseEntity.ok(orgChart);
    }

    /**
     * Get the org chart for a specific department.
     *
     * @param departmentId The ID of the department
     * @return The org chart for the specified department
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<OrgChartNodeDTO> getOrgChartByDepartment(@PathVariable Long departmentId) {
        OrgChartNodeDTO orgChart = orgChartService.getOrgChartByDepartment(departmentId);
        return ResponseEntity.ok(orgChart);
    }

    /**
     * Get the department hierarchy.
     *
     * @return A list of departments in a hierarchical structure
     */
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDTO>> getDepartmentHierarchy() {
        List<DepartmentDTO> departments = orgChartService.getDepartmentHierarchy();
        return ResponseEntity.ok(departments);
    }

    /**
     * Get all employee hierarchy relationships.
     *
     * @return A list of all employee hierarchy relationships
     */
    @GetMapping("/hierarchies")
    public ResponseEntity<List<EmployeeHierarchyDTO>> getAllEmployeeHierarchies() {
        List<EmployeeHierarchyDTO> hierarchies = orgChartService.getAllEmployeeHierarchies();
        return ResponseEntity.ok(hierarchies);
    }

    /**
     * Create or update an employee hierarchy relationship.
     *
     * @param employeeHierarchyDTO The employee hierarchy data
     * @return The created or updated employee hierarchy
     */
    @PostMapping("/hierarchies")
    public ResponseEntity<EmployeeHierarchyDTO> saveEmployeeHierarchy(@RequestBody EmployeeHierarchyDTO employeeHierarchyDTO) {
        EmployeeHierarchyDTO savedHierarchy = orgChartService.saveEmployeeHierarchy(employeeHierarchyDTO);
        return new ResponseEntity<>(savedHierarchy, HttpStatus.CREATED);
    }

    /**
     * Delete an employee hierarchy relationship.
     *
     * @param id The ID of the hierarchy relationship to delete
     * @return No content response
     */
    @DeleteMapping("/hierarchies/{id}")
    public ResponseEntity<Void> deleteEmployeeHierarchy(@PathVariable Long id) {
        orgChartService.deleteEmployeeHierarchy(id);
        return ResponseEntity.noContent().build();
    }
} 