import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-dispatch-note',
  templateUrl: './add-edit-dispatch-note.component.html',
  styleUrl: './add-edit-dispatch-note.component.scss'
})
export class AddEditDispatchNoteComponent {
  constructor(private router: Router) {}

  onCancelPress(){
    this.router.navigate(['master/dispatchNote']);
  }
}