import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StorageService } from '../../providers/storageService';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  leads: Array<any> = [];
  totalLeads: number = 0;

  constructor(
    public navCtrl: NavController,
    private storageService: StorageService
  ) {
  }

  // Load leads from database
  ionViewWillEnter() {
    this.storageService.getAllRecords().then((leads) => {
      this.leads = leads;
      this.totalLeads = leads.length;
    }).catch((err) => {
      // Issue loading leads..
    });
  }

}
