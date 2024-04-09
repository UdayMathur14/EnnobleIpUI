import { Component } from '@angular/core';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrl: './transporter.component.scss'
})
export class TransporterComponent {
  constructor(){}
  searchedTransporter : any;
  isFilters : boolean = true;

  searchTransporter(event:any){
    this.searchedTransporter = event;
  }
}