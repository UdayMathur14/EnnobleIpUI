import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-material',
  templateUrl: './approval-material.component.html',
  styleUrl: './approval-material.component.scss'
})
export class ApprovalMaterialComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

}
