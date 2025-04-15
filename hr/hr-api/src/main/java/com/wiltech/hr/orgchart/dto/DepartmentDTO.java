package com.wiltech.hr.orgchart.dto;

import java.util.ArrayList;
import java.util.List;

public class DepartmentDTO {
    private Long id;
    private String name;
    private String description;
    private Long managerId;
    private String managerName;
    private Long parentDepartmentId;
    private String parentDepartmentName;
    private List<DepartmentDTO> childDepartments = new ArrayList<>();

    // Default constructor
    public DepartmentDTO() {
    }

    // Constructor with fields
    public DepartmentDTO(Long id, String name, String description, Long managerId, 
                         String managerName, Long parentDepartmentId, String parentDepartmentName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.managerId = managerId;
        this.managerName = managerName;
        this.parentDepartmentId = parentDepartmentId;
        this.parentDepartmentName = parentDepartmentName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Long getParentDepartmentId() {
        return parentDepartmentId;
    }

    public void setParentDepartmentId(Long parentDepartmentId) {
        this.parentDepartmentId = parentDepartmentId;
    }

    public String getParentDepartmentName() {
        return parentDepartmentName;
    }

    public void setParentDepartmentName(String parentDepartmentName) {
        this.parentDepartmentName = parentDepartmentName;
    }

    public List<DepartmentDTO> getChildDepartments() {
        return childDepartments;
    }

    public void setChildDepartments(List<DepartmentDTO> childDepartments) {
        this.childDepartments = childDepartments;
    }

    public void addChildDepartment(DepartmentDTO childDepartment) {
        this.childDepartments.add(childDepartment);
    }
} 