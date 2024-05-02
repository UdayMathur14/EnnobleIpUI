import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {

  isFilters: boolean = false;
  filterKeyword: string = '';

  constructor(private router: Router,
    private plantService: PlantService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  exportData(fileName: string = "Plants") {
    this.exportService.csvExport(fileName);
  }

}
