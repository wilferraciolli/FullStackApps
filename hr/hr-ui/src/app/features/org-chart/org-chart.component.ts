import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

interface OrgNode {
  name: string;
  type: 'org' | 'department' | 'job';
  status?: 'occupied' | 'vacant';
  employee?: string;
  position?: string;
  children?: OrgNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  type: 'org' | 'department' | 'job';
  status?: 'occupied' | 'vacant';
  employee?: string;
  position?: string;
  level: number;
}

@Component({
  selector: 'app-org-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent {
  private _transformer = (node: OrgNode, level: number): FlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      type: node.type,
      status: node.status,
      employee: node.employee,
      position: node.position,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = [
      {
        name: 'TechCorp International',
        type: 'org',
        children: [
          {
            name: 'Sales Department',
            type: 'department',
            children: [
              {
                name: 'Sales Director',
                type: 'job',
                status: 'occupied',
                employee: 'Sarah Wilson',
                position: 'Sales Director'
              },
              {
                name: 'Sales Manager - North',
                type: 'job',
                status: 'occupied',
                employee: 'John Smith',
                position: 'Sales Manager'
              },
              {
                name: 'Sales Manager - South',
                type: 'job',
                status: 'vacant',
                position: 'Sales Manager'
              }
            ]
          },
          {
            name: 'Marketing Department',
            type: 'department',
            children: [
              {
                name: 'Marketing Director',
                type: 'job',
                status: 'occupied',
                employee: 'Emily Davis',
                position: 'Marketing Director'
              },
              {
                name: 'Digital Marketing Manager',
                type: 'job',
                status: 'occupied',
                employee: 'Mike Johnson',
                position: 'Digital Marketing Manager'
              },
              {
                name: 'Content Strategist',
                type: 'job',
                status: 'vacant',
                position: 'Content Strategist'
              }
            ]
          },
          {
            name: 'IT Department',
            type: 'department',
            children: [
              {
                name: 'IT Director',
                type: 'job',
                status: 'occupied',
                employee: 'David Chen',
                position: 'IT Director'
              },
              {
                name: 'Senior Developer',
                type: 'job',
                status: 'vacant',
                position: 'Senior Developer'
              },
              {
                name: 'System Administrator',
                type: 'job',
                status: 'occupied',
                employee: 'Anna Lee',
                position: 'System Administrator'
              }
            ]
          }
        ]
      }
    ];
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getNodeIcon(node: FlatNode): string {
    switch (node.type) {
      case 'org':
        return 'business';
      case 'department':
        return 'groups';
      case 'job':
        return node.status === 'occupied' ? 'person' : 'person_outline';
      default:
        return 'arrow_right';
    }
  }

  getNodeClass(node: FlatNode): string {
    return `node-${node.type} ${node.status || ''}`;
  }
}
