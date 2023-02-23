import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Usuario } from '../../auth/interfaces/auth.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
  *{margin:15px}
  `
  ]
})
export class DashboardComponent {
  get usuario() {
    return this.authService.usuario;
  }
  constructor(private route: Router,
    private authService: AuthService) { }

  logOut() {
    this.route.navigateByUrl('/auth/')
    this.authService.logout();
  }
}
