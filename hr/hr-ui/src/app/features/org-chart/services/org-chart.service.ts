import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrgChartNode } from '../models/org-chart-node.model';

@Injectable({
  providedIn: 'root'
})
export class OrgChartService {
  private apiUrl = 'http://localhost:8080/api/org-chart';

  constructor(private http: HttpClient) { }

  /**
   * Get the complete organization chart
   */
  getOrgChart(): Observable<OrgChartNode> {
    return this.http.get<OrgChartNode>(this.apiUrl);
  }

  /**
   * Get the org chart starting from a specific employee
   * @param employeeId The ID of the employee to use as the root
   */
  getOrgChartByEmployee(employeeId: number): Observable<OrgChartNode> {
    return this.http.get<OrgChartNode>(`${this.apiUrl}/employee/${employeeId}`);
  }

  /**
   * Get the org chart for a specific department
   * @param departmentId The ID of the department
   */
  getOrgChartByDepartment(departmentId: number): Observable<OrgChartNode> {
    return this.http.get<OrgChartNode>(`${this.apiUrl}/department/${departmentId}`);
  }
} 