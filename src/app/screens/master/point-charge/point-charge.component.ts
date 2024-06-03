import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { ExportService } from '../../../core/service/export.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-point-charge',
  templateUrl: './point-charge.component.html',
  styleUrls: ['./point-charge.component.scss']
})
export class PointChargeComponent implements OnInit {
  isFilters: boolean = false;
  filterKeyword: string = '';
  fullScreen : boolean = false;
  locations:any[] = APIConstant.locationsListDropdown;
  locationIds:any[]=[];

  constructor(private router: Router,
    private exportService: ExportService
  ) { }


  ngOnInit() {

  }

  // NAVIGATING TO CREATE POINT CHARGE PAGE
  onCreatePointCharge() {
    this.router.navigate(['master/addPointCharge'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  exportData(fileName: string = "Point Charge") {
    this.exportService.csvExport(fileName);
  }
}
