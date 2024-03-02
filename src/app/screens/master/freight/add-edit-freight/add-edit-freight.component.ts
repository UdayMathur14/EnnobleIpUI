import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-freight',
  templateUrl: './add-edit-freight.component.html',
  styleUrl: './add-edit-freight.component.scss'
})
export class AddEditFreightComponent {
  constructor(private router: Router) {}

  onCancelPress(){
    this.router.navigate(['master/freight']);
  }
}
