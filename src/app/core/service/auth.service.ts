import { Injectable } from '@angular/core';
import { APIConstant } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private authSecretKey = 'profile';

  constructor() { 
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
  }
  
  login(): boolean {
    if (localStorage.getItem(this.authSecretKey)) {
      this.isAuthenticated = true;
      return true;
    } else {
      return false;
    }
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.clear();
    this.isAuthenticated = false;
    window.location.href = APIConstant.Ums + `/auth/login`;
  }
}