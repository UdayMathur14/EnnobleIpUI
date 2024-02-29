import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-plant',
  templateUrl: './add-edit-plant.component.html',
  styleUrl: './add-edit-plant.component.scss'
})
export class AddEditPlantComponent {
  constructor(private router : Router){}

  onCancelPress(){
    this.router.navigate(['/master/plant'])
  }

}


