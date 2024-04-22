import { Component } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrl: './transporter.component.scss'
})
export class TransporterComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  constructor(private exportAsService: ExportAsService){}
  searchedTransporter : any;
  isFilters : boolean = true;

  searchTransporter(event:any){
    this.searchedTransporter = event;
  }

  exportData(fileName : string){
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }
}