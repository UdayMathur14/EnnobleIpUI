import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-point-master-accounts-grid-table',
  templateUrl: './point-master-accounts-grid-table.component.html',
  styleUrl: './point-master-accounts-grid-table.component.scss'
})
export class PointMasterAccountsGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

}