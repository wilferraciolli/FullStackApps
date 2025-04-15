package com.wiltech.hr.orgchart.service;

import com.wiltech.hr.employee.entity.Employee;
import com.wiltech.hr.employee.repository.EmployeeRepository;
import com.wiltech.hr.exception.ResourceNotFoundException;
import com.wiltech.hr.orgchart.dto.DepartmentDTO;
import com.wiltech.hr.orgchart.dto.EmployeeHierarchyDTO;
import com.wiltech.hr.orgchart.dto.OrgChartNodeDTO;
import com.wiltech.hr.orgchart.entity.Department;
import com.wiltech.hr.orgchart.entity.EmployeeHierarchy;
import com.wiltech.hr.orgchart.repository.DepartmentRepository;
import com.wiltech.hr.orgchart.repository.EmployeeHierarchyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrgChartServiceImpl implements OrgChartService {

    private final EmployeeHierarchyRepository employeeHierarchyRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public OrgChartServiceImpl(EmployeeHierarchyRepository employeeHierarchyRepository,
                               DepartmentRepository departmentRepository,
                               EmployeeRepository employeeRepository) {
        this.employeeHierarchyRepository = employeeHierarchyRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public OrgChartNodeDTO getOrgChart() {
        // Find the top-level employees (typically CEO or executive team)
        List<EmployeeHierarchy> topLevelHierarchies = employeeHierarchyRepository.findByManagerIsNull();
        
        if (topLevelHierarchies.isEmpty()) {
            return null;
        }
        
        // For simplicity, we'll use the first top-level employee as the root
        EmployeeHierarchy rootHierarchy = topLevelHierarchies.get(0);
        Employee rootEmployee = rootHierarchy.getEmployee();
        Department rootDepartment = rootHierarchy.getDepartment();
        
        // Create the root node
        OrgChartNodeDTO rootNode = createOrgChartNode(rootEmployee, rootDepartment);
        
        // Build the full hierarchy recursively
        buildOrgChartHierarchy(rootNode, rootEmployee.getId());
        
        return rootNode;
    }

    @Override
    @Transactional(readOnly = true)
    public OrgChartNodeDTO getOrgChartByEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        
        EmployeeHierarchy hierarchy = employeeHierarchyRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee Hierarchy", "employeeId", employeeId));
        
        // Create the node for the specified employee
        OrgChartNodeDTO node = createOrgChartNode(employee, hierarchy.getDepartment());
        
        // Build the hierarchy for this employee's subordinates
        buildOrgChartHierarchy(node, employeeId);
        
        return node;
    }

    @Override
    @Transactional(readOnly = true)
    public OrgChartNodeDTO getOrgChartByDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));
        
        // Get the department manager
        Employee manager = department.getManager();
        if (manager == null) {
            throw new ResourceNotFoundException("Department", "manager", "null");
        }
        
        // Create the root node for the department (the manager)
        OrgChartNodeDTO rootNode = createOrgChartNode(manager, department);
        
        // Find all employees in this department
        List<EmployeeHierarchy> departmentHierarchies = employeeHierarchyRepository.findByDepartmentId(departmentId);
        
        // Create a map of employees by their IDs for quick lookup
        Map<Long, OrgChartNodeDTO> employeeNodes = new HashMap<>();
        employeeNodes.put(manager.getId(), rootNode);
        
        // Create nodes for all employees in the department
        for (EmployeeHierarchy hierarchy : departmentHierarchies) {
            Employee employee = hierarchy.getEmployee();
            
            // Skip the manager as we already created a node for them
            if (employee.getId().equals(manager.getId())) {
                continue;
            }
            
            OrgChartNodeDTO employeeNode = createOrgChartNode(employee, department);
            employeeNodes.put(employee.getId(), employeeNode);
        }
        
        // Connect the nodes according to the reporting hierarchy
        for (EmployeeHierarchy hierarchy : departmentHierarchies) {
            Employee employee = hierarchy.getEmployee();
            Employee employeeManager = hierarchy.getManager();
            
            // Skip the top manager who has no manager in this context
            if (employeeManager == null || employee.getId().equals(manager.getId())) {
                continue;
            }
            
            OrgChartNodeDTO employeeNode = employeeNodes.get(employee.getId());
            OrgChartNodeDTO managerNode = employeeNodes.get(employeeManager.getId());
            
            if (employeeNode != null && managerNode != null) {
                managerNode.addChild(employeeNode);
            }
        }
        
        return rootNode;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentHierarchy() {
        // Get all top-level departments (those without a parent)
        List<Department> topLevelDepartments = departmentRepository.findByParentDepartmentIsNull();
        
        // Convert to DTOs and build the hierarchy
        return topLevelDepartments.stream()
                .map(this::convertToDepartmentDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeHierarchyDTO> getAllEmployeeHierarchies() {
        return employeeHierarchyRepository.findAll().stream()
                .map(this::convertToEmployeeHierarchyDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeeHierarchyDTO saveEmployeeHierarchy(EmployeeHierarchyDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", dto.getEmployeeId()));
        
        Employee manager = null;
        if (dto.getManagerId() != null) {
            manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", dto.getManagerId()));
        }
        
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));
        
        EmployeeHierarchy hierarchy;
        if (dto.getId() != null) {
            hierarchy = employeeHierarchyRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("EmployeeHierarchy", "id", dto.getId()));
        } else {
            hierarchy = new EmployeeHierarchy();
        }
        
        hierarchy.setEmployee(employee);
        hierarchy.setManager(manager);
        hierarchy.setDepartment(department);
        hierarchy.setPositionLevel(dto.getPositionLevel());
        
        EmployeeHierarchy savedHierarchy = employeeHierarchyRepository.save(hierarchy);
        return convertToEmployeeHierarchyDTO(savedHierarchy);
    }

    @Override
    @Transactional
    public void deleteEmployeeHierarchy(Long id) {
        if (!employeeHierarchyRepository.existsById(id)) {
            throw new ResourceNotFoundException("EmployeeHierarchy", "id", id);
        }
        employeeHierarchyRepository.deleteById(id);
    }

    // Helper methods
    private OrgChartNodeDTO createOrgChartNode(Employee employee, Department department) {
        String fullName = employee.getFirstName() + " " + employee.getLastName();
        String imageUrl = "https://via.placeholder.com/150"; // Default placeholder image
        
        return new OrgChartNodeDTO(
                employee.getId().toString(),
                fullName,
                employee.getJobTitle(),
                department.getName(),
                employee.getEmail(),
                imageUrl
        );
    }

    private void buildOrgChartHierarchy(OrgChartNodeDTO parentNode, Long managerId) {
        // Find all employees reporting to this manager
        List<EmployeeHierarchy> directReports = employeeHierarchyRepository.findByManagerId(managerId);
        
        for (EmployeeHierarchy hierarchy : directReports) {
            Employee employee = hierarchy.getEmployee();
            Department department = hierarchy.getDepartment();
            
            // Create a node for this employee
            OrgChartNodeDTO childNode = createOrgChartNode(employee, department);
            
            // Add this node as a child of the parent
            parentNode.addChild(childNode);
            
            // Recursively build the hierarchy for this employee's subordinates
            buildOrgChartHierarchy(childNode, employee.getId());
        }
    }

    private DepartmentDTO convertToDepartmentDTO(Department department) {
        Employee manager = department.getManager();
        Department parentDepartment = department.getParentDepartment();
        
        DepartmentDTO dto = new DepartmentDTO(
                department.getId(),
                department.getName(),
                department.getDescription(),
                manager != null ? manager.getId() : null,
                manager != null ? manager.getFirstName() + " " + manager.getLastName() : null,
                parentDepartment != null ? parentDepartment.getId() : null,
                parentDepartment != null ? parentDepartment.getName() : null
        );
        
        // Process child departments recursively
        List<DepartmentDTO> childDepartmentDTOs = new ArrayList<>();
        for (Department childDepartment : department.getChildDepartments()) {
            childDepartmentDTOs.add(convertToDepartmentDTO(childDepartment));
        }
        dto.setChildDepartments(childDepartmentDTOs);
        
        return dto;
    }

    private EmployeeHierarchyDTO convertToEmployeeHierarchyDTO(EmployeeHierarchy hierarchy) {
        Employee employee = hierarchy.getEmployee();
        Employee manager = hierarchy.getManager();
        Department department = hierarchy.getDepartment();
        
        return new EmployeeHierarchyDTO(
                hierarchy.getId(),
                employee.getId(),
                employee.getFirstName() + " " + employee.getLastName(),
                employee.getJobTitle(),
                employee.getEmail(),
                manager != null ? manager.getId() : null,
                manager != null ? manager.getFirstName() + " " + manager.getLastName() : null,
                department.getId(),
                department.getName(),
                hierarchy.getPositionLevel()
        );
    }
} 