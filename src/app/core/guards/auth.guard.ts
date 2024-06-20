import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { APIConstant } from '../constants';
import { CommonUtility } from '../utilities/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad  {
  constructor(private authService: AuthService, private router: Router) {}

  get menu(){return [];
    const profile:any = localStorage.getItem("profile");
    const userData = JSON.parse(profile);
    const mfgMenu = userData.app;
    //console.log(CommonUtility.flatten(svcMenu.menus))
    if(!mfgMenu){
      return [];
    }
    return CommonUtility.flatten(mfgMenu.menus);
  }

  securityGroups(permission:String){
    if(this.menu.find((e:any)=>e.key===permission)){
      return true;
    }
    return true;
  }

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }

  canDeactivate(component:any): boolean {
    if (component.hasUnsavedChanges()) {
      return window.confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  canLoad(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticatedUser()) {
      return true;
    } else {
      // Redirect to the login page if the user is not authenticated
      //this.router.navigate(['/login']);
      window.location.href  = APIConstant.Ums+`/auth/login`;
      return false;
    }
  }

}