import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'wt-root',
  imports: [RouterOutlet, MatToolbar, MatIconButton, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'websockets-ngx-ui';

  private readonly _routerService: Router = inject(Router);

  public navigateToHome() {
    this._routerService.navigate(['']);
  }

}
