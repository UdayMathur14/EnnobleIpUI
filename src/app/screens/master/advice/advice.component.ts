import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrl: './advice.component.scss'
})
export class AdviceComponent {

  filterKeyword: string = '';
  isFilters: boolean = false;
  fullScreen : boolean = false;
  adviceList: any [] = [];
  headers: any [] = [];

  constructor(private router: Router,
    private xlsxService: XlsxService
  ) { }

  onCreateAdvice() {
    this.router.navigate(['master/addEditAdvice', '0'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  onAdviceListChange(adviceList: any[]) {
    this.adviceList = adviceList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Advice") {
    // Map the data to include only the necessary fields
    const mappedAdviceList = this.adviceList.map(advice => ({
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
