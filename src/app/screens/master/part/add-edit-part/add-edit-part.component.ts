import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-part',
  templateUrl: './add-edit-part.component.html',
  styleUrl: './add-edit-part.component.scss'
})
export class AddEditPartComponent {
  constructor(private router: Router) {}

  onGoToEditPlan(){
    this.router.navigate(['mfgMasters/editPart']);
  }
}