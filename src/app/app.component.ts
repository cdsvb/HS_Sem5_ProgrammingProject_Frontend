import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Recommender-Frontend';
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  isExpanded = false;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  hover: boolean = false;

  constructor(private router: Router) { }

  hoverStyle(): Object {
    if(this.hover) {
      return {backgroundColor: 'grey', color: 'white'};
    }
    return {backgroundColor: 'white', color: 'black'};
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
}

