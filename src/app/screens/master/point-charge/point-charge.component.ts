import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-point-charge',
  templateUrl: './point-charge.component.html',
  styleUrls: ['./point-charge.component.scss']
})
export class PointChargeComponent implements OnInit {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  constructor(private router: Router,
    private exportAsService: ExportAsService
  ) { }

  isFilters: boolean = false;
  filterKeyword: string = '';

  ngOnInit() {

  }

  // NAVIGATING TO CREATE POINT CHARGE PAGE
  onCreatePointCharge() {
    this.router.navigate(['master/addPointCharge'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  exportData(fileName : string){
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }
}
