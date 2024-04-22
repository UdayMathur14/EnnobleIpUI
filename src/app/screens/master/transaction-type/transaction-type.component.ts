import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.scss']
})
export class TransactionTypeComponent implements OnInit {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }

  constructor(private router : Router,
    private exportAsService: ExportAsService
  ){}

  isFilters : boolean = false;
  filterKeyword : string = '';

  ngOnInit() { }

  onSearch(e:any){
    this.filterKeyword = e.target.value;
  }

  exportData(fileName : string){
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }
}
