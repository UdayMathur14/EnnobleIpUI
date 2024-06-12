import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdviceTypeService } from '../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
<<<<<<< HEAD
import { APIConstant } from '../../../core/constants';
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

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
<<<<<<< HEAD
  locations: any[] = APIConstant.locationsListDropdown;
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
<<<<<<< HEAD
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
=======
      "locationIds": [
        0
      ],
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
<<<<<<< HEAD
      "locationIds": e.locationIds,
=======
      "locationIds": [
        0
      ],
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
