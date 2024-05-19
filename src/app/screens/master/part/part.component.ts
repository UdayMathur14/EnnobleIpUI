import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss'
})
export class PartComponent {

  constructor(private router: Router,
    private exportService: ExportService
  ) { }

  isFilters: boolean = true;
  searchedPart: string = '';
  fullScreen : boolean = false;

  onCreatePart() {
    this.router.navigate(['master/addEditPart', '0'])
  }

  searchPart(event: any) {
    this.searchedPart = event;
  }

  exportData(fileName: string = "Part") {
    this.exportService.csvExport(fileName);
  }

}
