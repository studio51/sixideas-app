import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {
  constructor(
    public authenticationService: AuthenticationService

  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authenticationService.isAuthenticated();
  }
}