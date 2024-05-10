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
  allPartNumbers: string[] = [];
  filteredItems: { partNum: string[], partName: string[] } = { partNum: [], partName: [] };
  showSuggestions: { partNum: boolean, partName: boolean } = { partNum: false, partName: false };

  ngOnInit(): void {
    this.getAllPartsListInit();
  }

  // BINDING PART NUMBERS AND PART NAMES DROPDOWNS
  getAllPartsListInit() {
    let data = {
      "partNumber": '',
      "partName": ''
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.allPartsNames = response.parts.map((part: any) => part.partName);
      this.allPartNumbers = response.parts.map((part: any) => part.partNumber);
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

  onInput(inputType: string, event: Event) {
    const inputText = (event.target as HTMLInputElement)?.value || '';
    if (inputType === 'partNum') {
      this.filteredItems.partNum = this.allPartNumbers.filter(num => num.toLowerCase().includes(inputText.toLowerCase()));
      this.filteredItems.partNum.length ? this.showSuggestions.partNum = true : this.showSuggestions.partNum = false;
    } else if (inputType === 'partName') {
      this.filteredItems.partName = this.allPartsNames.filter(name => name.toLowerCase().includes(inputText.toLowerCase()));
      this.filteredItems.partName.length ? this.showSuggestions.partName = true : this.showSuggestions.partName = false;
    }
  }

  // Sets the selected item, clears the filtered items list, and hides the suggestion dropdown.
  selectItem(inputType: string, item: string) {
    if (inputType === 'partNum') {
      this.partNum = item;
      this.filteredItems.partNum = [];
      this.showSuggestions.partNum = false;
    } else if (inputType === 'partName') {
      this.partName = item;
      this.filteredItems.partName = [];
      this.showSuggestions.partName = false;
    }
  }

  // Click occurred outside the search dropdown, close it
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSuggestions.partNum = false;
      this.showSuggestions.partName = false;
    }
  }

}