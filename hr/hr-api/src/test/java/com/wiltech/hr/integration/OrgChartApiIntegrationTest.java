package com.wiltech.hr.integration;

import com.wiltech.hr.orgchart.dto.DepartmentDTO;
import com.wiltech.hr.orgchart.dto.EmployeeHierarchyDTO;
import com.wiltech.hr.orgchart.dto.OrgChartNodeDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class OrgChartApiIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/org-chart";
    }

    @Test
    public void testGetOrgChart() {
        ResponseEntity<OrgChartNodeDTO> response = restTemplate.getForEntity(
                getBaseUrl(),
                OrgChartNodeDTO.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // More specific assertions would depend on test data
    }

    @Test
    public void testGetOrgChartByEmployee() {
        // Assuming we have an employee with ID 1
        ResponseEntity<OrgChartNodeDTO> response = restTemplate.getForEntity(
                getBaseUrl() + "/employee/1",
                OrgChartNodeDTO.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // More specific assertions would depend on test data
    }

    @Test
    public void testGetOrgChartByDepartment() {
        // Assuming we have a department with ID 1
        ResponseEntity<OrgChartNodeDTO> response = restTemplate.getForEntity(
                getBaseUrl() + "/department/1",
                OrgChartNodeDTO.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // More specific assertions would depend on test data
    }

    @Test
    public void testGetDepartmentHierarchy() {
        ResponseEntity<List<DepartmentDTO>> response = restTemplate.exchange(
                getBaseUrl() + "/departments",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<DepartmentDTO>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // More specific assertions would depend on test data
    }

    @Test
    public void testGetAllEmployeeHierarchies() {
        ResponseEntity<List<EmployeeHierarchyDTO>> response = restTemplate.exchange(
                getBaseUrl() + "/hierarchies",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EmployeeHierarchyDTO>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // More specific assertions would depend on test data
    }

    @Test
    public void testSaveAndDeleteEmployeeHierarchy() {
        // Create a new hierarchy
        EmployeeHierarchyDTO newHierarchy = new EmployeeHierarchyDTO();
        newHierarchy.setEmployeeId(1L);
        newHierarchy.setManagerId(2L);
        newHierarchy.setDepartmentId(1L);

        ResponseEntity<EmployeeHierarchyDTO> createResponse = restTemplate.postForEntity(
                getBaseUrl() + "/hierarchies",
                newHierarchy,
                EmployeeHierarchyDTO.class
        );

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getBody()).isNotNull();
        assertThat(createResponse.getBody().getId()).isNotNull();

        // Delete the created hierarchy
        Long hierarchyId = createResponse.getBody().getId();
        restTemplate.delete(getBaseUrl() + "/hierarchies/" + hierarchyId);

        // Verify it was deleted - this would require a GET endpoint for a single hierarchy
        // which doesn't exist in the current API, so we'll check the full list
        ResponseEntity<List<EmployeeHierarchyDTO>> listResponse = restTemplate.exchange(
                getBaseUrl() + "/hierarchies",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EmployeeHierarchyDTO>>() {}
        );

        assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(listResponse.getBody()).isNotNull();
        
        // Check that the deleted hierarchy is not in the list
        boolean hierarchyExists = listResponse.getBody().stream()
                .anyMatch(h -> h.getId().equals(hierarchyId));
        
        assertThat(hierarchyExists).isFalse();
    }
} 