import { Component, NgZone } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';

import { SettingsService } from '../../providers/settingsService';
import { StorageService } from '../../providers/storageService';
import { UploadService } from '../../providers/uploadService';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  pendingRecords: any = [];
  pendingUploads: number = 0;

  constructor(
    public navCtrl: NavController,
    private settingsService: SettingsService,
    private storageService: StorageService,
    private uploadService: UploadService,
    private ev: Events,
    private toastCtrl: ToastController,
    private zone: NgZone
  ) {
    this.ev.subscribe('update:pending', () => {
      this.zone.run(() => {
        this.refreshPendingCount();
      });
    });
  }

  // Get all pending records
  ionViewWillEnter() {
    this.refreshPendingCount();
  }  

  // Refresh pending count
  refreshPendingCount() {
    this.storageService.getPendingRecords().then((data) => {
      this.pendingRecords = data;
      this.pendingUploads = data.length;
    }).catch(() => {});
  }

  // onChange, save to local storage
  saveSettings() {
    this.settingsService.saveSettingsToLocal();
  }

  // Attempt to upload scans
  forceUpload() {
    if (!window.navigator.onLine) {
      let toast = this.toastCtrl.create({
        message: 'Please check your internet connection..',
        duration: 2500,
        position: 'top'
      });
      toast.present();
      return false;
    }
    this.storageService.getPendingRecords().then((data) => {
      if (data && data.length > 0) {
        this.uploadService.uploadRecords(data);
      } else {
        let toast = this.toastCtrl.create({
          message: 'No pending uploads..',
          duration: 2500,
          position: 'top'
        });
        toast.present();
      }
    });
  }

  // Start new upload time
  startNewUploadTime() {
    this.settingsService.saveSettingsToLocal();
    this.uploadService.initializeBackgroundUpload(this.settingsService.settings.backgroundUploadWait);
  }

}
