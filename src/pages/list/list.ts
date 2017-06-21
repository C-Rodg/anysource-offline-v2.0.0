import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import * as moment from 'moment';

import { StorageService } from '../../providers/storageService';
import { CapturePage } from '../capture/capture';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  leads: Array<any> = [];
  totalLeads: number = 0;

  constructor(
    public navCtrl: NavController,
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
  }

  // Load leads from database
  ionViewWillEnter() {
    this.refreshLeads();
  }

  // Refresh leads 
  refreshLeads() {
    this.storageService.getAllRecords().then((leads) => {
      this.leads = leads.sort((leadA, leadB) => {
        return moment(leadB.survey.qrEditDateTime).diff(moment(leadA.survey.qrEditDateTime));
      });
      this.totalLeads = leads.length;
    }).catch((err) => {
      // Issue loading leads..
    });
  }

  // Edit record
  editRecord(lead) {
    this.navCtrl.push(CapturePage, lead);
  }

  // Delete this record
  deleteRecord(leadGuid: string) {
    let alert = this.alertCtrl.create({
      title: 'Delete this record?',
      subTitle: 'Are you sure you want to delete? You cannot recover this record after deletion.',
      buttons: [{
        text: 'Keep',
        role: 'cancel'
      }, {
        text: 'Delete',
        handler: () => {
          this.storageService.deleteRecord(leadGuid).then(()=> {
            this.refreshLeads();
            let toast = this.toastCtrl.create({
              message: `Record has been successfully deleted.`,
              duration: 2500,
              position: 'top'
            });
            toast.present();            
          }).catch((err) => {
            let toast = this.toastCtrl.create({
              message: `We're having issues deleting this record...`,
              duration: 2500,
              position: 'top', 
              cssClass: 'notify-error'
            });
            toast.present();
          })
        }
      }]
    });
    alert.present();
  }

}
