import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-freight-master-accounts-grid-table',
  templateUrl: './freight-master-accounts-grid-table.component.html',
  styleUrl: './freight-master-accounts-grid-table.component.scss'
})
export class FreightMasterAccountsGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

}