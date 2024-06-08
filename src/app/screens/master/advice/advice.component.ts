import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { AdviceTypeService } from '../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrl: './advice.component.scss'
})
export class AdviceComponent implements OnInit{
  advicesList: any[] = [];
  isFilters: boolean = true;
  fullScreen : boolean = false;
  loadSpinner : boolean = true;
  constructor(private router: Router,
    private exportService: ExportService,
    private adviceService : AdviceTypeService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.getAdviceTypesList();
  }

  getAdviceTypesList() {
    let data = {
      "locationIds": [
        0
      ],
      "adviceType": ""
    }
    this.adviceService.getAdviceTypes(data).subscribe((response: any) => {
      this.advicesList = response.advices;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "locationIds": [
        0
      ],
      "adviceType": e.adviceType
    }
    this.adviceService.getAdviceTypes(data).subscribe((response: any) => {
      this.advicesList = response.advices;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onCreateAdvice() {
    this.router.navigate(['master/addEditAdvice', '0'])
  }

  exportData(fileName: string = "Advice") {
    this.exportService.csvExport(fileName);
  }
}
