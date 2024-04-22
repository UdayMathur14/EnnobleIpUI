import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss'
})
export class LookupComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  isFilters : boolean = false;
  filterKeyword : string = '';

  constructor(private router: Router,
    private exportAsService: ExportAsService
  ){}

  onCreateLookup(){
    this.router.navigate(['master/addEditLookup', '0'])
  }

  onSearch(e:any){
    this.filterKeyword = e.target.value;
  }

  exportData(fileName: string) {
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }

}
