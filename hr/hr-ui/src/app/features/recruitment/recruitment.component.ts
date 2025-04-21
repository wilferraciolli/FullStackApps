import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

interface Vacancy {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number;
  status: 'Open' | 'Closed';
  skills: string[];
}

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent {
  vacancies: Vacancy[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      applicants: 12,
      status: 'Open',
      skills: ['JavaScript', 'Angular', 'Node.js']
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'New York',
      type: 'Full-time',
      applicants: 8,
      status: 'Open',
      skills: ['Product Strategy', 'Agile', 'User Research']
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'London',
      type: 'Contract',
      applicants: 5,
      status: 'Closed',
      skills: ['UI/UX', 'Figma', 'User Testing']
    }
  ];
}
