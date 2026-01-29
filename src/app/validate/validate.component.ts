import { Component, OnInit } from '@angular/core';
import { BaseService } from '../core/service/base.service';
import { LookupService } from '../core/service/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APIConstant } from '../core/constants';
import { ValidateService } from '../core/service/validate.service';
import { BootService } from '../core/service/boot.service';

@Component({
  templateUrl: './validate.component.html',
  styleUrls: ['validate.component.scss'],
})
export class ValidateComponent implements OnInit {
  loadSpinner: boolean = false;
  locations: any;
  validate = 'Validating...';
  umsTokens: any;
  userId: any;
  umsToken: any;
  totalAssignors: any;
  permissions: any;

  constructor(
    private bootService: BootService,
    private lookupService: LookupService,
    public baseService: BaseService,
    public validateService: ValidateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    localStorage.clear();
    this.activatedRoute.queryParams.subscribe((params) => {
      const data = params['data'];
      const appId = params['appId'];
      this.umsTokens = params['data'];
      this.validateService.getPermissions(appId, data).subscribe(
        (response: any) => {
          if (typeof window !== 'undefined' && localStorage) {
            localStorage.setItem('profile', JSON.stringify(response));
            localStorage.setItem(
              'userName',
              JSON.stringify(response?.userName),
            );
            localStorage.setItem('umsToken', data);
          }
          const profiledata = localStorage.getItem('profile');
          if (profiledata) {
            const profileObj = JSON.parse(profiledata);
            this.permissions = profileObj.permissions.map((perm: any) =>
              perm.toLowerCase(),
            );
            console.log(this.permissions);
          }
          if (this.permissions.includes('assign_ticket_add')) {
            // this.getAssignorssList();
          }

          // Call Lookup API here to store dropdown data
          //this.getLookupMasterData(this.umsTokens);

          setTimeout(() => {
            this.router.navigate(['/master']);
          }, 2000);
        },
        (error: any) => {
          console.error('Error fetching permissions:', error);
          this.validate = 'Validation Failed! Please try again.';
        },
      );
    });
  }
}
