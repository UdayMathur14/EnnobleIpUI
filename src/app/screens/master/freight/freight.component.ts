import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent {

  isFilters: boolean = true;
  searchedFreight: any;
  fullScreen : boolean = false;
  constructor(private router: Router,
    private exportService: ExportService
  ) { }

  //HOLDING SEARCHED VALUE FROM FILTERS
  searchFreightCode(event: any) {
    this.searchedFreight = event;
  }

  //FUNCTION TO REDIRECT USER ON FREIGHT CREATION SCREEN
  onCreateFreight() {
    this.router.navigate(['master/addEditFreight', '0'])
  }

  exportData(fileName: string = "Freight") {
    this.exportService.csvExport(fileName);
  }
} 
