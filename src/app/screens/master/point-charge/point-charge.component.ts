import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { PointChargeService } from '../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-point-charge',
  templateUrl: './point-charge.component.html',
  styleUrls: ['./point-charge.component.scss']
})
export class PointChargeComponent implements OnInit {
  isFilters: boolean = true;
  fullScreen : boolean = false;
  loadSpinner : boolean = true;
  pointChargesList : any[] = [];
  constructor(private router: Router,
    private exportService: ExportService,
    private pointChargeService : PointChargeService,
    private toastr : ToastrService
  ) { }


  ngOnInit() {
    this.getPointChargesList();
  }

  getPointChargesList() {
    let data = {
      "locationIds": [
        0
      ],
      "screenCode": 101,
      "pointName": ""
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any) {
    this.loadSpinner = true;
    let data = {
      "locationIds": [
        0
      ],
      "screenCode": 101,
      "pointName": e.pointName || ""
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  // NAVIGATING TO CREATE POINT CHARGE PAGE
  onCreatePointCharge() {
    this.router.navigate(['master/addPointCharge'])
  }

  exportData(fileName: string = "Point Charge") {
    this.exportService.csvExport(fileName);
  }
}
