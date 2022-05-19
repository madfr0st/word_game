import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-cm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  showFiller = false;
  mode = new FormControl('over');
  @ViewChild('sidenav') sidenav: any;
  constructor() { }

  ngOnInit(): void {
  }

  event($event: any) {
    this.sidenav.toggle();
  }

}
