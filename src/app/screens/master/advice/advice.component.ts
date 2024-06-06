import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrl: './advice.component.scss'
})
export class AdviceComponent {

  filterKeyword: string = '';
  isFilters: boolean = false;
  fullScreen: boolean = false;
  locations: any[] = APIConstant.locationsListDropdown;
  locationIds: any[] = [];

  constructor(private router: Router,
    private exportService: ExportService
  ) { }

  onCreateAdvice() {
    this.router.navigate(['master/addEditAdvice', '0'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  exportData(fileName: string = "Advice") {
    this.exportService.csvExport(fileName);
  }
}
