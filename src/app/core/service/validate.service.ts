// import { Injectable } from "@angular/core";
// import { CRUDService } from "./crud.service";
// import { BaseService } from "./base.service";
// import { APIConstant } from "../constants";
// import { PlantRequest } from "../models/plant";
// import { map, BehaviorSubject } from 'rxjs';

// @Injectable({
//     providedIn: "root",
// })
// export class ValidateService extends CRUDService<PlantRequest> {
//     constructor(protected override baseService: BaseService) {
//         super(baseService, APIConstant.basePath);
//     }

//     generateToken(data: any, accessToken: string) {
//         const headers = new Headers();
//         headers.append('Authorization', `Bearer ${accessToken}`);
//         return this.baseService.getWithHeader(APIConstant.commonURL + APIConstant.generateToken(data.appId), {headers:headers});
//     }
// }


import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
  providedIn: "root",
})
export class ValidateService extends CRUDService<PlantRequest> {
  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  /**
   * Generates a new token after clearing cache and cookies.
   */
  generateToken(data: any, accessToken: string) {
    debugger
    // Clear cookies and cache to prevent conflicts
    this.clearCacheAndCookies();

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');

    return this.baseService.getWithHeader(
      `${APIConstant.commonURL}${APIConstant.generateToken(data.appId)}`, 
      { headers }
    );
  }

  /**
   * Clears cache, cookies, and storage.
   */
  private clearCacheAndCookies() {
    console.log('Clearing cookies, cache, and storage...');

    // Clear specific tokens from localStorage and sessionStorage
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('profile'); // Example: Remove 'profile' if exists

    // Optionally, clear all entries from both storages
    localStorage.clear();
    sessionStorage.clear();

    // Clear all non-HttpOnly cookies
    document.cookie.split(';').forEach(cookie => {
      const [key] = cookie.split('=');
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    console.log('Cache and cookies cleared.');
  }
}
