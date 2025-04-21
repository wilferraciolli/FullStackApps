package com.wiltech.hr.orgchart.dto;

public class EmployeeHierarchyDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeTitle;
    private String employeeEmail;
    private Long managerId;
    private String managerName;
    private Long departmentId;
    private String departmentName;
    private Integer positionLevel;

    // Default constructor
    public EmployeeHierarchyDTO() {
    }

    // Constructor with fields
    public EmployeeHierarchyDTO(Long id, Long employeeId, String employeeName, String employeeTitle, 
                               String employeeEmail, Long managerId, String managerName, 
                               Long departmentId, String departmentName, Integer positionLevel) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeTitle = employeeTitle;
        this.employeeEmail = employeeEmail;
        this.managerId = managerId;
        this.managerName = managerName;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionLevel = positionLevel;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeTitle() {
        return employeeTitle;
    }

    public void setEmployeeTitle(String employeeTitle) {
        this.employeeTitle = employeeTitle;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Integer getPositionLevel() {
        return positionLevel;
    }

    public void setPositionLevel(Integer positionLevel) {
        this.positionLevel = positionLevel;
    }
} 