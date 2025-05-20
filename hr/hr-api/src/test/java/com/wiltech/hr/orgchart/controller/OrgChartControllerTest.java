package com.wiltech.hr.orgchart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wiltech.hr.orgchart.dto.DepartmentDTO;
import com.wiltech.hr.orgchart.dto.EmployeeHierarchyDTO;
import com.wiltech.hr.orgchart.dto.OrgChartNodeDTO;
import com.wiltech.hr.orgchart.service.OrgChartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrgChartController.class)
public class OrgChartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrgChartService orgChartService;

    private OrgChartNodeDTO rootNode;
    private OrgChartNodeDTO departmentNode;
    private OrgChartNodeDTO employeeNode;
    private List<DepartmentDTO> departments;
    private List<EmployeeHierarchyDTO> hierarchies;
    private EmployeeHierarchyDTO hierarchy;

    @BeforeEach
    void setUp() {
        // Setup a sample organization chart structure
        employeeNode = new OrgChartNodeDTO(
                "emp-123",
                "John Doe",
                "Software Engineer",
                "Engineering",
                "john.doe@example.com",
                null
        );

        departmentNode = new OrgChartNodeDTO(
                "dept-456",
                "Engineering",
                "Department",
                null,
                null,
                null
        );
        departmentNode.addChild(employeeNode);

        rootNode = new OrgChartNodeDTO(
                "org-789",
                "ACME Corporation",
                "Organization",
                null,
                null,
                null
        );
        rootNode.addChild(departmentNode);

        // Setup departments
        DepartmentDTO engineering = new DepartmentDTO();
        engineering.setId(1L);
        engineering.setName("Engineering");
        engineering.setDescription("Engineering Department");

        DepartmentDTO hr = new DepartmentDTO();
        hr.setId(2L);
        hr.setName("Human Resources");
        hr.setDescription("HR Department");

        departments = Arrays.asList(engineering, hr);

        // Setup hierarchies
        hierarchy = new EmployeeHierarchyDTO();
        hierarchy.setId(1L);
        hierarchy.setEmployeeId(123L);
        hierarchy.setManagerId(456L);
        hierarchy.setDepartmentId(1L);

        EmployeeHierarchyDTO hierarchy2 = new EmployeeHierarchyDTO();
        hierarchy2.setId(2L);
        hierarchy2.setEmployeeId(789L);
        hierarchy2.setManagerId(456L);
        hierarchy2.setDepartmentId(1L);

        hierarchies = Arrays.asList(hierarchy, hierarchy2);
    }

    @Test
    void getOrgChart_ShouldReturnCompleteOrgChart() throws Exception {
        when(orgChartService.getOrgChart()).thenReturn(rootNode);

        mockMvc.perform(get("/api/org-chart"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("org-789")))
                .andExpect(jsonPath("$.name", is("ACME Corporation")))
                .andExpect(jsonPath("$.title", is("Organization")))
                .andExpect(jsonPath("$.children", hasSize(1)))
                .andExpect(jsonPath("$.children[0].id", is("dept-456")))
                .andExpect(jsonPath("$.children[0].name", is("Engineering")))
                .andExpect(jsonPath("$.children[0].children", hasSize(1)))
                .andExpect(jsonPath("$.children[0].children[0].id", is("emp-123")))
                .andExpect(jsonPath("$.children[0].children[0].name", is("John Doe")));

        verify(orgChartService, times(1)).getOrgChart();
    }

    @Test
    void getOrgChartByEmployee_ShouldReturnEmployeeOrgChart() throws Exception {
        when(orgChartService.getOrgChartByEmployee(123L)).thenReturn(employeeNode);

        mockMvc.perform(get("/api/org-chart/employee/123"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("emp-123")))
                .andExpect(jsonPath("$.name", is("John Doe")))
                .andExpect(jsonPath("$.title", is("Software Engineer")))
                .andExpect(jsonPath("$.department", is("Engineering")))
                .andExpect(jsonPath("$.email", is("john.doe@example.com")));

        verify(orgChartService, times(1)).getOrgChartByEmployee(123L);
    }

    @Test
    void getOrgChartByDepartment_ShouldReturnDepartmentOrgChart() throws Exception {
        when(orgChartService.getOrgChartByDepartment(456L)).thenReturn(departmentNode);

        mockMvc.perform(get("/api/org-chart/department/456"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("dept-456")))
                .andExpect(jsonPath("$.name", is("Engineering")))
                .andExpect(jsonPath("$.title", is("Department")))
                .andExpect(jsonPath("$.children", hasSize(1)))
                .andExpect(jsonPath("$.children[0].id", is("emp-123")));

        verify(orgChartService, times(1)).getOrgChartByDepartment(456L);
    }

    @Test
    void getDepartmentHierarchy_ShouldReturnAllDepartments() throws Exception {
        when(orgChartService.getDepartmentHierarchy()).thenReturn(departments);

        mockMvc.perform(get("/api/org-chart/departments"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Engineering")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Human Resources")));

        verify(orgChartService, times(1)).getDepartmentHierarchy();
    }

    @Test
    void getAllEmployeeHierarchies_ShouldReturnAllHierarchies() throws Exception {
        when(orgChartService.getAllEmployeeHierarchies()).thenReturn(hierarchies);

        mockMvc.perform(get("/api/org-chart/hierarchies"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].employeeId", is(123)))
                .andExpect(jsonPath("$[0].managerId", is(456)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].employeeId", is(789)));

        verify(orgChartService, times(1)).getAllEmployeeHierarchies();
    }

    @Test
    void saveEmployeeHierarchy_ShouldCreateAndReturnHierarchy() throws Exception {
        when(orgChartService.saveEmployeeHierarchy(any(EmployeeHierarchyDTO.class))).thenReturn(hierarchy);

        mockMvc.perform(post("/api/org-chart/hierarchies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(hierarchy)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.employeeId", is(123)))
                .andExpect(jsonPath("$.managerId", is(456)))
                .andExpect(jsonPath("$.departmentId", is(1)));

        verify(orgChartService, times(1)).saveEmployeeHierarchy(any(EmployeeHierarchyDTO.class));
    }

    @Test
    void deleteEmployeeHierarchy_ShouldDeleteHierarchy() throws Exception {
        doNothing().when(orgChartService).deleteEmployeeHierarchy(1L);

        mockMvc.perform(delete("/api/org-chart/hierarchies/1"))
                .andExpect(status().isNoContent());

        verify(orgChartService, times(1)).deleteEmployeeHierarchy(1L);
    }
} 