import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../../../core/service/vendor.service';
import { BaseService } from '../../../../core/service/base.service';
import { VendorDataModel } from '../../../../core/model/vendor.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-vendor',
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.scss'
})
export class AddEditVendorComponent implements OnInit {
  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private baseService: BaseService,
    private toastr: ToastrService,
  ) { }
  queryData: any;
  vendorData!: VendorDataModel;
  vendorsList: any = [];

  ngOnInit(): void {
    this.baseService.vendorSpinner.next(true);
    this.queryData = this._Activatedroute.snapshot.paramMap.get("vendorId");
    this.getVendorData(this.queryData);
  }

  getVendorData(vendorId: string) {
    this.vendorService.getVendorData(vendorId).subscribe((response: any) => {
      console.log(response);
      this.vendorData = response;
      this.baseService.vendorSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.vendorSpinner.next(false);
    })
  }

  onPressSave() {
    this.baseService.vendorSpinner.next(true);
    let data = {
      vendorCode: this.vendorData.vendorCode,
      contactNumber: this.vendorData.contactNumber,
      email: this.vendorData.email,
      poinName: this.vendorData.poinName,
      status: this.vendorData.status
    }
    this.vendorService.updateVendor(this.queryData, data).subscribe((response: any) => {
      this.vendorData = response;
      this.toastr.success("Vendor Update Successfully");
      this.baseService.vendorSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.vendorSpinner.next(false);
    })
  }

  onCancelPress() {
    this.router.navigate(['master/vendor']);
  }
}
