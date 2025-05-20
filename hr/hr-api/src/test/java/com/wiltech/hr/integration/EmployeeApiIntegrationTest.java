package com.wiltech.hr.integration;

import com.wiltech.hr.employee.dto.EmployeeDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class EmployeeApiIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/employees";
    }

    @Test
    public void testGetAllEmployees() {
        ResponseEntity<List<EmployeeDTO>> response = restTemplate.exchange(
                getBaseUrl(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EmployeeDTO>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // Specific assertions will depend on the test data setup
    }

    @Test
    public void testCreateAndGetEmployee() {
        // Create a new employee
        EmployeeDTO newEmployee = new EmployeeDTO(
                null,
                "Integration",
                "Test",
                "integration.test@example.com",
                "555-8765",
                LocalDate.now(),
                "Integration Tester",
                new BigDecimal("70000"),
                "QA"
        );

        ResponseEntity<EmployeeDTO> createResponse = restTemplate.postForEntity(
                getBaseUrl(),
                newEmployee,
                EmployeeDTO.class
        );

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getBody()).isNotNull();
        assertThat(createResponse.getBody().getId()).isNotNull();
        
        // Get the created employee by ID
        Long employeeId = createResponse.getBody().getId();
        ResponseEntity<EmployeeDTO> getResponse = restTemplate.getForEntity(
                getBaseUrl() + "/" + employeeId,
                EmployeeDTO.class
        );

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).isNotNull();
        assertThat(getResponse.getBody().getId()).isEqualTo(employeeId);
        assertThat(getResponse.getBody().getFirstName()).isEqualTo("Integration");
        assertThat(getResponse.getBody().getLastName()).isEqualTo("Test");
    }

    @Test
    public void testUpdateEmployee() {
        // Create employee to update
        EmployeeDTO newEmployee = new EmployeeDTO(
                null,
                "Update",
                "Test",
                "update.test@example.com",
                "555-4321",
                LocalDate.now(),
                "Update Tester",
                new BigDecimal("65000"),
                "QA"
        );

        ResponseEntity<EmployeeDTO> createResponse = restTemplate.postForEntity(
                getBaseUrl(),
                newEmployee,
                EmployeeDTO.class
        );

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getBody()).isNotNull();

        // Update the employee
        Long employeeId = createResponse.getBody().getId();
        EmployeeDTO employeeToUpdate = createResponse.getBody();
        employeeToUpdate.setLastName("Updated");
        employeeToUpdate.setSalary(new BigDecimal("70000"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<EmployeeDTO> requestEntity = new HttpEntity<>(employeeToUpdate, headers);

        ResponseEntity<EmployeeDTO> updateResponse = restTemplate.exchange(
                getBaseUrl() + "/" + employeeId,
                HttpMethod.PUT,
                requestEntity,
                EmployeeDTO.class
        );

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody()).isNotNull();
        assertThat(updateResponse.getBody().getLastName()).isEqualTo("Updated");
        assertThat(updateResponse.getBody().getSalary()).isEqualTo(new BigDecimal("70000"));
    }

    @Test
    public void testDeleteEmployee() {
        // Create employee to delete
        EmployeeDTO newEmployee = new EmployeeDTO(
                null,
                "Delete",
                "Test",
                "delete.test@example.com",
                "555-9999",
                LocalDate.now(),
                "Delete Tester",
                new BigDecimal("60000"),
                "QA"
        );

        ResponseEntity<EmployeeDTO> createResponse = restTemplate.postForEntity(
                getBaseUrl(),
                newEmployee,
                EmployeeDTO.class
        );

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getBody()).isNotNull();
        Long employeeId = createResponse.getBody().getId();

        // Delete the employee
        restTemplate.delete(getBaseUrl() + "/" + employeeId);

        // Verify it was deleted
        ResponseEntity<EmployeeDTO> getResponse = restTemplate.getForEntity(
                getBaseUrl() + "/" + employeeId,
                EmployeeDTO.class
        );

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetEmployeesByDepartment() {
        ResponseEntity<List<EmployeeDTO>> response = restTemplate.exchange(
                getBaseUrl() + "/department/QA",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EmployeeDTO>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // Additional assertions would depend on test data
    }

    @Test
    public void testGetEmployeesByJobTitle() {
        ResponseEntity<List<EmployeeDTO>> response = restTemplate.exchange(
                getBaseUrl() + "/job-title/Integration Tester",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EmployeeDTO>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // Additional assertions would depend on test data
    }
} 