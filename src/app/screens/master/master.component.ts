import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent implements OnInit{
  userData : any = localStorage.getItem('logindata');
  userName : string = "";
  isFilters : boolean = false;
  

  constructor(){}

  ngOnInit(): void {
    debugger
    this.userName = JSON.parse(this.userData).username;
  }
}
