import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StorageService } from '../../providers/storageService';

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html'
})
export class CapturePage {
  
  editFlag: boolean = false;
  saveText: string = "Save Record";

  constructor(
    private storageService: StorageService,
    public navCtrl: NavController
  ) {

  }

  ionViewWillEnter() {

  }

  // Save new lead or edited lead
  saveRecord() {
    
  }
}
