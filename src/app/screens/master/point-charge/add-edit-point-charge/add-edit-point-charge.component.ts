import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-add-edit-point-charge',
  templateUrl: './add-edit-point-charge.component.html',
  styleUrl: './add-edit-point-charge.component.scss'
})
export class AddEditPointChargeComponent {
  constructor(private router : Router){}
  plantCode : any = '';
  data = [
    {name: "United States", code:"USA"},
    {name: "United States", code:"USA"},
    {name: "United States", code:"USA"},
    {name: "United States", code:"USA"}
  ];

  results :any = [];

  onCancelPress(){
    this.router.navigate(['/master/pointCharge'])
  }

  filterCountry(e:any){
    this.results = this.data.filter((element) => element.name.toLowerCase().indexOf(e.query.toLowerCase()) !== -1)
  }

}


