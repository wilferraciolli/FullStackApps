import { OrgChartNode } from '../models/org-chart-node.model';
import { OrgNode } from '../org-chart.component';

/**
 * Adapter class to convert API data to our component's format.
 */
export class OrgChartAdapter {
  
  /**
   * Converts the API org chart data to the format expected by the org-chart component
   * @param apiData The API response data
   * @returns Converted data for the org-chart component
   */
  static convertToOrgNode(apiData: OrgChartNode): OrgNode {
    // Create the organization node
    const rootNode: OrgNode = {
      name: apiData.name,
      type: 'org',
      children: []
    };
    
    // Create a map to store departments by their name
    const departmentMap = new Map<string, OrgNode>();
    
    // Process all the children
    if (apiData.children && apiData.children.length > 0) {
      // First pass: Identify all departments
      for (const child of apiData.children) {
        // Check if this node represents a VP/Director level (usually direct reports to CEO)
        if (child.title.toLowerCase().includes('vp') || 
            child.title.toLowerCase().includes('director') ||
            child.title.toLowerCase().includes('counsel') ||
            child.title.toLowerCase().includes('manager')) {
          
          // Create department node if it doesn't exist
          const deptName = child.department;
          if (!departmentMap.has(deptName)) {
            const departmentNode: OrgNode = {
              name: deptName,
              type: 'department',
              children: []
            };
            departmentMap.set(deptName, departmentNode);
            rootNode.children?.push(departmentNode);
          }
          
          // Add this executive as a job under their department
          const departmentNode = departmentMap.get(deptName);
          if (departmentNode) {
            departmentNode.children?.push({
              name: child.title,
              type: 'job',
              status: 'occupied',
              employee: child.name,
              position: child.title,
              children: []
            });
          }
          
          // Process this executive's direct reports
          if (child.children && child.children.length > 0) {
            for (const report of child.children) {
              // Find the department for this report
              let reportDeptNode = departmentMap.get(report.department);
              
              // If department doesn't exist yet, create it
              if (!reportDeptNode) {
                reportDeptNode = {
                  name: report.department,
                  type: 'department',
                  children: []
                };
                departmentMap.set(report.department, reportDeptNode);
                rootNode.children?.push(reportDeptNode);
              }
              
              // Add this direct report as a job
              reportDeptNode.children?.push({
                name: report.title,
                type: 'job',
                status: 'occupied',
                employee: report.name,
                position: report.title,
                children: []
              });
            }
          }
        }
      }
    }
    
    return rootNode;
  }
} 