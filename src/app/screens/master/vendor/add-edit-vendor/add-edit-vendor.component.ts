import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-vendor',
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.scss'
})
export class AddEditVendorComponent {
  constructor(private router : Router){}

  onCancelPress(){
    this.router.navigate(['master/vendor']);
  }
}
