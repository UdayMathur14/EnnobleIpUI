import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdviceTypeService } from '../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { APIConstant } from '../../../core/constants';

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
  locations: any[] = APIConstant.locationsListDropdown;
  currentPage: number = 1;
  count: number = 10;
  totalAdvices: number = 0;
  filters: any = [];
  appliedFilters: any = {};
  maxCount: number = Number.MAX_VALUE;
  constructor(private router: Router,
    private adviceService : AdviceTypeService,
    private toastr : ToastrService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit(): void {
    this.getAdviceTypesList();
  }

  getAdviceTypesList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    const data = {
      "locationIds": filters?.locationIds || APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "adviceType": filters?.adviceType || '',
      "status": filters?.status || ''
    }
    this.adviceService.getAdviceTypes(data, offset, count).subscribe((response: any) => {
      this.advicesList = response.advices;
      this.totalAdvices = response.paging.total;
      this.filters = response.filters;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getAdviceTypesList(0, this.count, this.appliedFilters);
  }

  onCreateAdvice() {
    this.router.navigate(['master/addEditAdvice', '0'])
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }



  exportData(fileName: string = "Advice") {
    const data = {
      "locationIds": this.appliedFilters?.locationIds || APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "adviceType": this.appliedFilters?.adviceType || '',
      "status": this.appliedFilters?.status || ''
    }
    
    this.adviceService.getAdviceTypes(data, 0, this.totalAdvices).subscribe((response: any) => {
      const adviceListToExport = response.advices
      const mappedAdviceList = adviceListToExport.map((advice:any) => ({
        location: advice.location.value,
        adviceType: advice.adviceType,
        batchName: advice.batchName,
        maxBiltiNumber: advice.maxBiltiNumber,
        manualAllocationRequired: advice.manualAllocationRequired,
        status: advice.status
      }));
      this.xlsxService.xlsxExport(mappedAdviceList, this.headers, fileName);
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAdviceTypesList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getAdviceTypesList(0, this.count, this.appliedFilters);
    }
}
