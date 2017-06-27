import { Component } from '@angular/core';
import { TabsPage } from '../pages/tabs/tabs';
import { UploadService } from '../providers/uploadService';
import { SettingsService } from '../providers/settingsService';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(
    private uploadService: UploadService,
    private settingsService: SettingsService  
  ) {
    this.startBackgroundUpload();
  }

  // Start the background upload
  startBackgroundUpload() {
    this.uploadService.initializeBackgroundUpload(this.settingsService.settings.backgroundUploadWait);
  }
}
