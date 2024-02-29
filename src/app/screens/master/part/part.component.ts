import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss'
})
export class PartComponent {
  constructor(private router : Router){}

  isFilters : boolean = false;

  onCreatePart(){
    this.router.navigate(['master/addEditPart'])
  }

}
