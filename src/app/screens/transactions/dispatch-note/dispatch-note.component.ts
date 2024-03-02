import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

  onCreateDispatchNote(){
    this.router.navigate(['transaction/addEditDispatchNote'])
  }
}
