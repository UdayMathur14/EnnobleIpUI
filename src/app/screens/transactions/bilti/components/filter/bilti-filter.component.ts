import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-bilti-filter',
  templateUrl: './bilti-filter.component.html',
  styleUrl: './bilti-filter.component.scss'
})
export class BiltiFilterComponent implements OnInit {

  @Output() biltiFilterData: EventEmitter<any> = new EventEmitter();

  biltiNum!: any | null;
  biltisList: any = [];
  loadSpinner: boolean = true;
  allBiltiNo: any = [];
  filteredBiltiNo: any = [];
  showSuggestionsBilti: boolean = false;
  locationIds:any[]=[];
  locations:any[] = APIConstant.locationsListDropdown;
  

  constructor(private biltiService: BiltiService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ){}

  ngOnInit(): void {
    this.getAllBiltisList();
  }

  getAllBiltisList() {
    let data = {
      biltiNumber: '',
      locationIds:this.locationIds
    };
    this.biltiService.getBiltis(data).subscribe(
      (response: any) => {
        this.biltisList = response.biltiCreations;
        this.allBiltiNo = response.biltiCreations.map((bilti: any) => bilti.biltiNumber);
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }
  
  onBiltiSearch() {
    let obj = {
      "biltiNumber": this.biltiNum || "",
      locationIds:this.locationIds
    }
    this.biltiFilterData.emit(obj)
  }

  selectSuggestionBiltiNo(bilti: string) {
    this.biltiNum = bilti;
    this.filteredBiltiNo = [];
    this.showSuggestionsBilti = false;
  }

  onBiltiNoInput(inputText: string) {
    this.filteredBiltiNo = this.allBiltiNo.filter((name: any) => name.toLowerCase().includes(inputText.toLowerCase()));
    this.filteredBiltiNo.length ? this.showSuggestionsBilti = true : this.showSuggestionsBilti = false;
  }
  
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSuggestionsBilti = false;
    }
  }
  
  onClearFilter() {
    this.biltiNum = null;
    let obj = {
      biltiNum: null,
    }
    this.biltiFilterData.emit(obj)
  }
}
