import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface Course {
  id: number;
  title: string;
  category: string;
  progress: number;
  duration: string;
  enrolled: boolean;
}

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss']
})
export class LearningComponent {
  courses: Course[] = [
    {
      id: 1,
      title: 'Leadership Fundamentals',
      category: 'Management',
      progress: 75,
      duration: '4 hours',
      enrolled: true
    },
    {
      id: 2,
      title: 'Project Management Essentials',
      category: 'Professional Skills',
      progress: 0,
      duration: '6 hours',
      enrolled: false
    },
    {
      id: 3,
      title: 'Communication Skills',
      category: 'Soft Skills',
      progress: 30,
      duration: '3 hours',
      enrolled: true
    }
  ];
}
