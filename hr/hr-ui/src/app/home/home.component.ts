import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrCardComponent } from '../shared/hr-card/hr-card.component';

interface HRCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HrCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  hrCards: HRCard[] = [
    {
      title: 'Human Resource Management',
      description: 'Manage employee data, contracts, and personnel information',
      icon: 'people',
      route: '/employees',
      color: '#2196F3'
    },
    {
      title: 'Organization Chart',
      description: 'View and manage company structure and reporting lines',
      icon: 'account_tree',
      route: '/org-chart',
      color: '#4CAF50'
    },
    {
      title: 'Learning & Development',
      description: 'Track employee training, certifications, and skill development',
      icon: 'school',
      route: '/learning',
      color: '#FF9800'
    },
    {
      title: 'Recruitment',
      description: 'Manage job postings, applications, and hiring processes',
      icon: 'person_search',
      route: '/recruitment',
      color: '#E91E63'
    },
    {
      title: 'Performance Management',
      description: 'Handle reviews, goals, and performance tracking',
      icon: 'trending_up',
      route: '/performance',
      color: '#9C27B0'
    }
  ];
}
