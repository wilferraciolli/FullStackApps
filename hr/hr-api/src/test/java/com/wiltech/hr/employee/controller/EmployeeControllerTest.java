package com.wiltech.hr.employee.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wiltech.hr.employee.dto.EmployeeDTO;
import com.wiltech.hr.employee.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeService employeeService;

    private EmployeeDTO employee1;
    private EmployeeDTO employee2;
    private List<EmployeeDTO> employees;

    @BeforeEach
    void setUp() {
        employee1 = new EmployeeDTO(
                1L,
                "John",
                "Doe",
                "john.doe@example.com",
                "555-1234",
                LocalDate.of(2020, 1, 15),
                "Software Engineer",
                new BigDecimal("75000"),
                "Engineering"
        );

        employee2 = new EmployeeDTO(
                2L,
                "Jane",
                "Smith",
                "jane.smith@example.com",
                "555-5678",
                LocalDate.of(2019, 3, 10),
                "Project Manager",
                new BigDecimal("85000"),
                "Product Management"
        );

        employees = Arrays.asList(employee1, employee2);
    }

    @Test
    void getAllEmployees_ShouldReturnAllEmployees() throws Exception {
        when(employeeService.getAllEmployees()).thenReturn(employees);

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].lastName", is("Doe")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].firstName", is("Jane")))
                .andExpect(jsonPath("$[1].lastName", is("Smith")));

        verify(employeeService, times(1)).getAllEmployees();
    }

    @Test
    void getEmployeeById_WithValidId_ShouldReturnEmployee() throws Exception {
        when(employeeService.getEmployeeById(1L)).thenReturn(employee1);

        mockMvc.perform(get("/api/employees/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")))
                .andExpect(jsonPath("$.email", is("john.doe@example.com")))
                .andExpect(jsonPath("$.phoneNumber", is("555-1234")))
                .andExpect(jsonPath("$.jobTitle", is("Software Engineer")))
                .andExpect(jsonPath("$.department", is("Engineering")));

        verify(employeeService, times(1)).getEmployeeById(1L);
    }

    @Test
    void createEmployee_ShouldCreateAndReturnNewEmployee() throws Exception {
        when(employeeService.createEmployee(any(EmployeeDTO.class))).thenReturn(employee1);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employee1)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")));

        verify(employeeService, times(1)).createEmployee(any(EmployeeDTO.class));
    }

    @Test
    void updateEmployee_WithValidIdAndData_ShouldUpdateAndReturnEmployee() throws Exception {
        EmployeeDTO updatedEmployee = new EmployeeDTO(
                1L,
                "John",
                "Doe Updated",
                "john.updated@example.com",
                "555-9876",
                LocalDate.of(2020, 1, 15),
                "Senior Software Engineer",
                new BigDecimal("85000"),
                "Engineering"
        );

        when(employeeService.updateEmployee(eq(1L), any(EmployeeDTO.class))).thenReturn(updatedEmployee);

        mockMvc.perform(put("/api/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEmployee)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.lastName", is("Doe Updated")))
                .andExpect(jsonPath("$.email", is("john.updated@example.com")))
                .andExpect(jsonPath("$.jobTitle", is("Senior Software Engineer")));

        verify(employeeService, times(1)).updateEmployee(eq(1L), any(EmployeeDTO.class));
    }

    @Test
    void deleteEmployee_WithValidId_ShouldDeleteEmployee() throws Exception {
        doNothing().when(employeeService).deleteEmployee(1L);

        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isNoContent());

        verify(employeeService, times(1)).deleteEmployee(1L);
    }

    @Test
    void getEmployeesByDepartment_ShouldReturnEmployeesInDepartment() throws Exception {
        List<EmployeeDTO> engineeringEmployees = Arrays.asList(employee1);
        when(employeeService.getEmployeesByDepartment("Engineering")).thenReturn(engineeringEmployees);

        mockMvc.perform(get("/api/employees/department/Engineering"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].department", is("Engineering")));

        verify(employeeService, times(1)).getEmployeesByDepartment("Engineering");
    }

    @Test
    void getEmployeesByJobTitle_ShouldReturnEmployeesWithJobTitle() throws Exception {
        List<EmployeeDTO> engineerEmployees = Arrays.asList(employee1);
        when(employeeService.getEmployeesByJobTitle("Software Engineer")).thenReturn(engineerEmployees);

        mockMvc.perform(get("/api/employees/job-title/Software Engineer"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].jobTitle", is("Software Engineer")));

        verify(employeeService, times(1)).getEmployeesByJobTitle("Software Engineer");
    }
} 