import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
  constructor(private router : Router){}

  isFilters : boolean = false;

  onCreateVendor(){
    this.router.navigate(['master/addEditVendor'])
  }
}
