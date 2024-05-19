import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { DispatchNoteService } from '../../../core/service/dispatch-note.service';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteComponent {

  isFilters : boolean = true;
  dispatchNumber:string="";
  dispatchNotes=[];
  loadSpinner : boolean = true;
  constructor(private router : Router,
    private dispatchNoteService: DispatchNoteService,
    private exportService:ExportService
  ){}

  ngOnInit() {
    this.getData();
  }

  handleSearch() {
    this.getData(this.dispatchNumber);
  }

  getData(dispatchNumber: string = "") {
    this.dispatchNoteService.getDispatchNote(dispatchNumber).subscribe((res: any) => {
      this.dispatchNotes = res.dispatchNotes;
      this.loadSpinner = false;
    })
  }

  onCreateDispatchNote(){
    this.router.navigate(['transaction/addEditDispatchNote/0'])
  }
}
