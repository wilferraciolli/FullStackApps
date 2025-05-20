package com.wiltech.hr.config;

import com.wiltech.hr.employee.dto.EmployeeDTO;
import com.wiltech.hr.employee.service.EmployeeService;
import com.wiltech.hr.orgchart.dto.DepartmentDTO;
import com.wiltech.hr.orgchart.dto.EmployeeHierarchyDTO;
import com.wiltech.hr.orgchart.service.OrgChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;

/**
 * Test configuration class that initializes test data for integration tests.
 */
@TestConfiguration
@Profile("test")
public class TestConfig {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private OrgChartService orgChartService;

    @PostConstruct
    public void init() {
        setupTestData();
    }

    private void setupTestData() {
        // Create departments
        DepartmentDTO engineeringDepartment = new DepartmentDTO();
        engineeringDepartment.setName("Engineering");
        engineeringDepartment.setDescription("Software Engineering Department");

        DepartmentDTO hrDepartment = new DepartmentDTO();
        hrDepartment.setName("Human Resources");
        hrDepartment.setDescription("HR Department");

        DepartmentDTO qaDepartment = new DepartmentDTO();
        qaDepartment.setName("QA");
        qaDepartment.setDescription("Quality Assurance Department");

        DepartmentDTO savedEngineering = orgChartService.saveDepartment(engineeringDepartment);
        DepartmentDTO savedHR = orgChartService.saveDepartment(hrDepartment);
        DepartmentDTO savedQA = orgChartService.saveDepartment(qaDepartment);

        // Create employees
        List<EmployeeDTO> employees = new ArrayList<>();

        // CEO
        EmployeeDTO ceo = new EmployeeDTO(
                null,
                "Jane",
                "CEO",
                "jane.ceo@example.com",
                "555-0001",
                LocalDate.of(2018, 1, 1),
                "Chief Executive Officer",
                new BigDecimal("250000"),
                null
        );

        // Engineering employees
        EmployeeDTO cto = new EmployeeDTO(
                null,
                "John",
                "CTO",
                "john.cto@example.com",
                "555-0002",
                LocalDate.of(2018, 2, 1),
                "Chief Technology Officer",
                new BigDecimal("200000"),
                savedEngineering.getName()
        );

        EmployeeDTO developer1 = new EmployeeDTO(
                null,
                "Alice",
                "Developer",
                "alice.dev@example.com",
                "555-0003",
                LocalDate.of(2020, 3, 15),
                "Senior Software Engineer",
                new BigDecimal("120000"),
                savedEngineering.getName()
        );

        EmployeeDTO developer2 = new EmployeeDTO(
                null,
                "Bob",
                "Coder",
                "bob.dev@example.com",
                "555-0004",
                LocalDate.of(2021, 5, 10),
                "Software Engineer",
                new BigDecimal("90000"),
                savedEngineering.getName()
        );

        // HR employees
        EmployeeDTO hrManager = new EmployeeDTO(
                null,
                "Carol",
                "Manager",
                "carol.hr@example.com",
                "555-0005",
                LocalDate.of(2019, 7, 20),
                "HR Manager",
                new BigDecimal("95000"),
                savedHR.getName()
        );

        EmployeeDTO hrAssistant = new EmployeeDTO(
                null,
                "Dave",
                "Assistant",
                "dave.hr@example.com",
                "555-0006",
                LocalDate.of(2022, 1, 5),
                "HR Assistant",
                new BigDecimal("65000"),
                savedHR.getName()
        );

        // QA employees
        EmployeeDTO qaManager = new EmployeeDTO(
                null,
                "Eve",
                "Tester",
                "eve.qa@example.com",
                "555-0007",
                LocalDate.of(2020, 8, 15),
                "QA Manager",
                new BigDecimal("100000"),
                savedQA.getName()
        );

        EmployeeDTO qaEngineer = new EmployeeDTO(
                null,
                "Frank",
                "QA",
                "frank.qa@example.com",
                "555-0008",
                LocalDate.of(2021, 9, 1),
                "QA Engineer",
                new BigDecimal("85000"),
                savedQA.getName()
        );

        // Save employees
        EmployeeDTO savedCEO = employeeService.createEmployee(ceo);
        EmployeeDTO savedCTO = employeeService.createEmployee(cto);
        EmployeeDTO savedDev1 = employeeService.createEmployee(developer1);
        EmployeeDTO savedDev2 = employeeService.createEmployee(developer2);
        EmployeeDTO savedHRManager = employeeService.createEmployee(hrManager);
        EmployeeDTO savedHRAssistant = employeeService.createEmployee(hrAssistant);
        EmployeeDTO savedQAManager = employeeService.createEmployee(qaManager);
        EmployeeDTO savedQAEngineer = employeeService.createEmployee(qaEngineer);

        // Create hierarchies
        // CEO is the top of the hierarchy
        
        // CTO reports to CEO
        EmployeeHierarchyDTO ctoHierarchy = new EmployeeHierarchyDTO();
        ctoHierarchy.setEmployeeId(savedCTO.getId());
        ctoHierarchy.setManagerId(savedCEO.getId());
        ctoHierarchy.setDepartmentId(savedEngineering.getId());
        
        // HR Manager reports to CEO
        EmployeeHierarchyDTO hrManagerHierarchy = new EmployeeHierarchyDTO();
        hrManagerHierarchy.setEmployeeId(savedHRManager.getId());
        hrManagerHierarchy.setManagerId(savedCEO.getId());
        hrManagerHierarchy.setDepartmentId(savedHR.getId());
        
        // QA Manager reports to CEO
        EmployeeHierarchyDTO qaManagerHierarchy = new EmployeeHierarchyDTO();
        qaManagerHierarchy.setEmployeeId(savedQAManager.getId());
        qaManagerHierarchy.setManagerId(savedCEO.getId());
        qaManagerHierarchy.setDepartmentId(savedQA.getId());
        
        // Developers report to CTO
        EmployeeHierarchyDTO dev1Hierarchy = new EmployeeHierarchyDTO();
        dev1Hierarchy.setEmployeeId(savedDev1.getId());
        dev1Hierarchy.setManagerId(savedCTO.getId());
        dev1Hierarchy.setDepartmentId(savedEngineering.getId());
        
        EmployeeHierarchyDTO dev2Hierarchy = new EmployeeHierarchyDTO();
        dev2Hierarchy.setEmployeeId(savedDev2.getId());
        dev2Hierarchy.setManagerId(savedCTO.getId());
        dev2Hierarchy.setDepartmentId(savedEngineering.getId());
        
        // HR Assistant reports to HR Manager
        EmployeeHierarchyDTO hrAssistantHierarchy = new EmployeeHierarchyDTO();
        hrAssistantHierarchy.setEmployeeId(savedHRAssistant.getId());
        hrAssistantHierarchy.setManagerId(savedHRManager.getId());
        hrAssistantHierarchy.setDepartmentId(savedHR.getId());
        
        // QA Engineer reports to QA Manager
        EmployeeHierarchyDTO qaEngineerHierarchy = new EmployeeHierarchyDTO();
        qaEngineerHierarchy.setEmployeeId(savedQAEngineer.getId());
        qaEngineerHierarchy.setManagerId(savedQAManager.getId());
        qaEngineerHierarchy.setDepartmentId(savedQA.getId());
        
        // Save hierarchies
        orgChartService.saveEmployeeHierarchy(ctoHierarchy);
        orgChartService.saveEmployeeHierarchy(hrManagerHierarchy);
        orgChartService.saveEmployeeHierarchy(qaManagerHierarchy);
        orgChartService.saveEmployeeHierarchy(dev1Hierarchy);
        orgChartService.saveEmployeeHierarchy(dev2Hierarchy);
        orgChartService.saveEmployeeHierarchy(hrAssistantHierarchy);
        orgChartService.saveEmployeeHierarchy(qaEngineerHierarchy);
    }
} 