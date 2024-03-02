import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrl: './advice.component.scss'
})
export class AdviceComponent {
  constructor(private router : Router){}

  isFilters : boolean = false;

  onCreateAdvice(){
    this.router.navigate(['master/addEditAdvice'])
  }
}
