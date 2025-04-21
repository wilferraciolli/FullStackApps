package com.wiltech.hr.orgchart.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO class designed to be used directly by the organization chart UI component.
 * It follows a hierarchical structure with parent-child relationships.
 */
public class OrgChartNodeDTO {
    private String id;
    private String name;
    private String title;
    private String department;
    private String email;
    private String imageUrl;
    private List<OrgChartNodeDTO> children = new ArrayList<>();

    // Default constructor
    public OrgChartNodeDTO() {
    }

    // Constructor with fields
    public OrgChartNodeDTO(String id, String name, String title, String department, String email, String imageUrl) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.department = department;
        this.email = email;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<OrgChartNodeDTO> getChildren() {
        return children;
    }

    public void setChildren(List<OrgChartNodeDTO> children) {
        this.children = children;
    }

    public void addChild(OrgChartNodeDTO child) {
        this.children.add(child);
    }
} 