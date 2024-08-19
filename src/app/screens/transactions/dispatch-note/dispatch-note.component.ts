import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { DispatchNoteService } from '../../../core/service/dispatch-note.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteComponent {

  isFilters: boolean = true;
  dispatchNumber: string = "";
  dispatchNotes = [];
  locations: any[] = APIConstant.locationsListDropdown;
  locationIds: any[] = APIConstant.locationsListDropdown.map((e: any) => (e.id));
  loadSpinner: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  totaldispatchNotes: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;

  constructor(private router: Router,
    private dispatchNoteService: DispatchNoteService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.getDispatchData();
  }


  getDispatchData(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    const data = {
      "locationIds": filters?.locationIds || APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "dispatchNumber": filters?.dispatchNumber || "",
      "status": filters?.status || "",
      "frlrNumber": filters?.frlrNo || ""
    }
    this.loadSpinner = true;
    this.dispatchNoteService.getDispatchNote(data, offset, count).subscribe((res: any) => {
      this.dispatchNotes = res.dispatchNotes;
      this.totaldispatchNotes = res.paging.total;
      this.filters = res.filters;
      this.loadSpinner = false;
    },error => {
      this.loadSpinner = false;
  }) 
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getDispatchData(0, this.count, this.appliedFilters);
  }

  onCreateDispatchNote() {
    this.router.navigate(['transaction/addEditDispatchNote/0'])
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getDispatchData(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getDispatchData(0, this.count, this.appliedFilters);
    }
}
