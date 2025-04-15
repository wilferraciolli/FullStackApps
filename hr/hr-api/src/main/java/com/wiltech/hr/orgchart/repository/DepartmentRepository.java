package com.wiltech.hr.orgchart.repository;

import com.wiltech.hr.orgchart.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    List<Department> findByParentDepartmentId(Long parentDepartmentId);
    
    List<Department> findByParentDepartmentIsNull();
    
    @Query("SELECT d FROM Department d WHERE d.manager.id = ?1")
    List<Department> findByManagerId(Long managerId);
} 