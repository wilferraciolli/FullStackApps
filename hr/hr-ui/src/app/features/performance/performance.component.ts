import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface Meeting {
  id: number;
  type: 'One-on-One' | 'Review';
  employee: string;
  manager: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent {
  meetings: Meeting[] = [
    {
      id: 1,
      type: 'One-on-One',
      employee: 'John Doe',
      manager: 'Sarah Wilson',
      date: '2024-03-20',
      status: 'Scheduled',
      notes: 'Monthly catch-up and goal review'
    },
    {
      id: 2,
      type: 'Review',
      employee: 'Jane Smith',
      manager: 'Tom Brown',
      date: '2024-03-15',
      status: 'Completed',
      notes: 'Annual performance review'
    },
    {
      id: 3,
      type: 'One-on-One',
      employee: 'Mike Johnson',
      manager: 'Emily Davis',
      date: '2024-03-22',
      status: 'Scheduled'
    }
  ];
}
