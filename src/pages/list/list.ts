import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  totalLeads: number = 0;

  constructor(public navCtrl: NavController) {

  }

}
