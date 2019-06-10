import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuardService implements CanActivate {
  constructor(
    private router: Router

  ) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log(route);

    let authInfo = {
      authenticated: true
    };

    if (!authInfo.authenticated) {
      this.router.navigate(['authentication']);
    }

    return authInfo.authenticated;
  }
}