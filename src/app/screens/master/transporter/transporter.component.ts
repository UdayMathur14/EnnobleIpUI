import { Component } from '@angular/core';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrl: './transporter.component.scss'
})
export class TransporterComponent {

  searchedTransporter: any;
  isFilters: boolean = true;
  fullScreen : boolean = false;
  constructor(private exportService: ExportService
  ) { }

  searchTransporter(event: any) {
    this.searchedTransporter = event;
  }

  exportData(fileName: string = "Transporter") {
    this.exportService.csvExport(fileName);
  }
}