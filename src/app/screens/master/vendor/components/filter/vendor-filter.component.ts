import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { VendorService } from '../../../../../core/service/vendor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendor-filter',
  templateUrl: './vendor-filter.component.html',
  styleUrl: './vendor-filter.component.scss'
})
export class VendorFilterComponent implements OnInit {
  constructor(
    private vendorService: VendorService,
    private elementRef: ElementRef,
    private toastr: ToastrService
  ) { }

  @Output() vendorFilterData: EventEmitter<any> = new EventEmitter();
  vendorCod!: string | undefined;
  vendorsList: any;
  vendorNam!: string;
  allVendorNames: string[] = [];
  filteredVendors: string[] = [];
  showSuggestions: boolean = false;

  ngOnInit(): void {
    this.getAllVendorsListInit();
  }

  getAllVendorsListInit() {
    let data = {
      "vendorCode": '',
      "vendorName": ''
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorsList = response.vendors;
      this.allVendorNames = response.vendors.map((vendor: any) => vendor.vendorName);
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
    });
  }

  onVendorSearch() {
    let obj = {
      "vendorCode": this.vendorCod || "",
      "vendorName": this.vendorNam || ""
    }
    this.vendorFilterData.emit(obj)
  }

  onClearFilter() {
    this.vendorCod = undefined;
    this.vendorNam = '';
    let obj = {
      vendorCod: '',
      vendorNam: ''
    }
    this.vendorFilterData.emit(obj)
  }

  // Filters vendor names based on user input and shows/hides suggestions accordingly.
  onVendorNameInput(inputText: string) {
    this.filteredVendors = this.allVendorNames.filter(name => name.toLowerCase().includes(inputText.toLowerCase()));
    this.filteredVendors.length ? this.showSuggestions = true : this.showSuggestions = false;
  }
 
  // Sets the selected vendor name, clears the filtered vendors list, and hides the suggestion dropdown.
  selectSuggestion(vendor: string) {
    this.vendorNam = vendor;
    this.filteredVendors = [];
    this.showSuggestions = false;
  }

  // Click occurred outside the search dropdown, close it
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
    }
  }
}
