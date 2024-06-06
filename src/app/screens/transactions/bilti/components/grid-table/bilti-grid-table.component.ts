import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { BiltiPdfModalComponent } from '../../../../modals/bilti-pdf/bilti-pdf.component';


@Component({
  selector: 'app-bilti-grid-table',
  templateUrl: './bilti-grid-table.component.html',
  styleUrl: './bilti-grid-table.component.scss'
})
export class BiltiGridTableComponent implements OnInit {
  biltisList: any = [];
  loadSpinner: boolean = false;
  @Input() searchedBilti: any;
  biltisListOrg: any;

  constructor(private router: Router,
    private modalService: NgbModal,
    private biltiService: BiltiService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllBiltisList();
  }

  onPreviewBilti() {
    let documentModal = this.modalService.open(DeliveryNoteModalComponent, {
      size: "lg",
      backdrop: "static",
    });
    documentModal.componentInstance.title = 'Bilti';

    documentModal.result.then(
      (result) => {
        if (result) {

        }
      },
      (reason) => {
      }
    );
  }

  onPreviewPdf(bilti: any) {
    let documentModal = this.modalService.open(BiltiPdfModalComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: 'modal-width',
    });
    documentModal.componentInstance.title = 'Bilti';
    documentModal.componentInstance.biltiData = bilti;

    documentModal.result.then(
      (result) => {
        if (result) {

        }
      },
      (reason) => {
      }
    );
  }

  onEditBilti(id: number) {
    this.router.navigate([`transaction/addEditBilti/${id}`]);
  }

  getAllBiltisList() {
    this.loadSpinner = true;
    let data = {
      biltiNumber: '',
      locationIds: []
    };
    this.biltiService.getBiltis(data).subscribe(
      (response: any) => {
        this.biltisList = response.biltiCreations;
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getFilteredBiltisList() {
    this.loadSpinner = true;
    let data = {
      "biltiNumber": this.searchedBilti.biltiNumber,
      locationIds: this.searchedBilti.locationIds
    }
    this.biltiService.getBiltis(data).subscribe((response: any) => {
      this.biltisList = response.biltiCreations;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedBilti'].currentValue) {
      this.getFilteredBiltisList();
    } else if (changes['searchedBilti'].firstChange === false && changes['searchedBilti'].currentValue === '') {
      this.getAllBiltisList();
    }

  }
}
