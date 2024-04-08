import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { PartService } from '../../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-part-filters',
  templateUrl: './part-filter.component.html',
  styleUrl: './part-filter.component.scss'
})
export class PartFiltersComponent implements OnInit {
  constructor(
    private partService: PartService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) { }
  @Output() partFilterObj: EventEmitter<object> = new EventEmitter();
  partNum: string | undefined;
  partName: string = '';
  partsList: any;
  allPartsNames: string[] = [];
  filteredParts: string[] = [];
  showSuggestions: boolean = false;

  ngOnInit(): void {
    this.getAllPartsListInit();
  }

  //BINDING PART NUMBERS DROPDOWN
  getAllPartsListInit() {
    let data = {
      "partNumber": ''
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.allPartsNames = response.parts.map((part: any) => part.partName);
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  onPartSearch() {
    let obj = {
      partName: this.partName,
      partCode: this.partNum
    }
    this.partFilterObj.emit(obj)
  }
  onClearFilter() {
    this.partNum = undefined;
    this.partName = '';
    let obj = {
      partName: '',
      partCode: ''
    }
    this.partFilterObj.emit(obj)
  }

  // Filters parts names based on user input and shows/hides suggestions accordingly.
  onPartNameInput(inputText: string) {
    this.filteredParts = this.allPartsNames.filter(name => name.toLowerCase().includes(inputText.toLowerCase()));
    this.filteredParts.length ? this.showSuggestions = true : this.showSuggestions = false;
  }

  // Sets the selected part name, clears the filtered vendors list, and hides the suggestion dropdown.
  selectSuggestion(part: string) {
    this.partName = part;
    this.filteredParts = [];
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
