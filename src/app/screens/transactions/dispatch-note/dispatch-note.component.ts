import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { DispatchNoteService } from '../../../core/service/dispatch-note.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteComponent {

  isFilters: boolean = true;
  dispatchNumber: string = "";
  dispatchNotes = [];
  locations: any[] = APIConstant.locationsListDropdown;
  locationIds: any[] = APIConstant.locationsListDropdown.map((e: any) => (e.id));
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private dispatchNoteService: DispatchNoteService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.getData(this.dispatchNumber, this.locationIds);
  }

  handleSearch() {
    this.getData(this.dispatchNumber, this.locationIds);
  }

  getData(dispatchNumber: string = "", locationIds: any[] = []) {
    this.loadSpinner = true;
    this.dispatchNoteService.getDispatchNote({ dispatchNumber, locationIds }).subscribe((res: any) => {
      this.dispatchNotes = res.dispatchNotes;
      this.loadSpinner = false;
    })
  }

  onCreateDispatchNote() {
    this.router.navigate(['transaction/addEditDispatchNote/0'])
  }
}
