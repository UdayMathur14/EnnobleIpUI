import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  isFilters : boolean = true;
  searchedFreight : any;
  
  constructor(private router : Router,
    private exportAsService: ExportAsService
  ){}

  //HOLDING SEARCHED VALUE FROM FILTERS
  searchFreightCode(event : any){
    this.searchedFreight = event;
  }

  //FUNCTION TO REDIRECT USER ON FREIGHT CREATION SCREEN
  onCreateFreight(){
    this.router.navigate(['master/addEditFreight', '0'])
  }

  exportData(fileName : string){
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }
} 
