import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-transporter',
  templateUrl: './add-edit-transporter.component.html',
  styleUrl: './add-edit-transporter.component.scss'
})
export class AddEditTransporterComponent {
  constructor(private router: Router) {}

  onCancelPress(){
    this.router.navigate(['/master/transporter'])
  }
}