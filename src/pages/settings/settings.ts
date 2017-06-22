import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
    private uploadService: UploadService
  ) {

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
    this.uploadService.uploadPending().then((d) => {
      console.log("BACK IN SETTINGS");
    }).catch((err) => {
      console.log("BACK IN SETTINGS - BUT FAILED : (");
      console.log(err);
    });
  }

}
