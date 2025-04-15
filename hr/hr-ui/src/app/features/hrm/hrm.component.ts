import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
}

interface Department {
  id: number;
  name: string;
  manager: string;
  employeeCount: number;
}

interface Job {
  id: number;
  title: string;
  department: string;
  level: string;
  status: string;
}

@Component({
  selector: 'app-hrm',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './hrm.component.html',
  styleUrls: ['./hrm.component.scss']
})
export class HrmComponent {
  employees: Employee[] = [
    { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'Engineering', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', department: 'Product', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', position: 'UX Designer', department: 'Design', email: 'mike@example.com' },
  ];

  departments: Department[] = [
    { id: 1, name: 'Engineering', manager: 'Sarah Wilson', employeeCount: 25 },
    { id: 2, name: 'Product', manager: 'Tom Brown', employeeCount: 12 },
    { id: 3, name: 'Design', manager: 'Emily Davis', employeeCount: 8 },
  ];

  jobs: Job[] = [
    { id: 1, title: 'Senior Software Engineer', department: 'Engineering', level: 'Senior', status: 'Open' },
    { id: 2, title: 'Product Owner', department: 'Product', level: 'Mid', status: 'Open' },
    { id: 3, title: 'UI/UX Designer', department: 'Design', level: 'Junior', status: 'Closed' },
  ];
}
