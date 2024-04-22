import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrl: './advice.component.scss'
})
export class AdviceComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  filterKeyword : string = '';
  isFilters : boolean = false;
  
  constructor(private router : Router,
    private exportAsService: ExportAsService
  ){}

  onCreateAdvice(){
    this.router.navigate(['master/addEditAdvice', '0'])
  }

  onSearch(e:any){
    this.filterKeyword = e.target.value;
  }

  exportData(fileName : string){
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }
}
