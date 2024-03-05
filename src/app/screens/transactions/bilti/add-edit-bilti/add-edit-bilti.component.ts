import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-bilti',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-bilti.component.html',
  styleUrl: './add-edit-bilti.component.scss'
})
export class AddEditBiltiComponent {
  constructor(private router : Router){}

  onCancelPress(){
    this.router.navigate(['transaction/bilti'])
  }
}
