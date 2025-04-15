package com.wiltech.hr.orgchart.repository;

import com.wiltech.hr.orgchart.entity.EmployeeHierarchy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeHierarchyRepository extends JpaRepository<EmployeeHierarchy, Long> {
    
    List<EmployeeHierarchy> findByManagerId(Long managerId);
    
    List<EmployeeHierarchy> findByManagerIsNull();
    
    Optional<EmployeeHierarchy> findByEmployeeId(Long employeeId);
    
    List<EmployeeHierarchy> findByDepartmentId(Long departmentId);
    
    @Query("SELECT eh FROM EmployeeHierarchy eh WHERE eh.positionLevel = 1")
    List<EmployeeHierarchy> findTopLevelEmployees();
} 