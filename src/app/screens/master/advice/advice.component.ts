import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdviceTypeService } from '../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';

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
  headers: string[] = [];
  constructor(private router: Router,
    private adviceService : AdviceTypeService,
    private toastr : ToastrService,
    private xlsxService : XlsxService
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

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Advice") {
    const mappedAdviceList = this.advicesList.map(advice => ({
      location: advice.location.value,
      adviceType: advice.adviceType,
      batchName: advice.batchName,
      maxBiltiNumber: advice.maxBiltiNumber,
      manualAllocationRequired: advice.manualAllocationRequired,
      status: advice.status
    }));
    this.xlsxService.xlsxExport(mappedAdviceList, this.headers, fileName);
  }
}
