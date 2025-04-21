import {Component, inject} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'wt-home',
  imports: [
    MatCardModule,
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly _routerService: Router = inject(Router);

  public navigateTo(routeName: string) {
    this._routerService.navigate([`/${routeName}`]);
  }
}
