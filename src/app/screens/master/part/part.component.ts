import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss'
})
export class PartComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  constructor(private router: Router,
    private exportAsService: ExportAsService
  ) { }

  isFilters: boolean = true;
  searchedPart: string = '';

  onCreatePart() {
    this.router.navigate(['master/addEditPart', '0'])
  }

  searchPart(event: any) {
    this.searchedPart = event;
  }

  exportData(fileName: string) {
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }

  }
