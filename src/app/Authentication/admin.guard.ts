import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { ErrorComponent } from '../Components/log-in/error/error.component';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private snackbar: MatSnackBar) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem('group') == "1")
      return true;
    else {
      this.snackbar.openFromComponent(ErrorComponent, {
        duration: 3000,
        data: 'Please Login to your Account!'
      });

      this.router.navigate(['/logIn']);
    }
  }
}

