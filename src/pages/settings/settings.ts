import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsService } from '../../providers/settingsService';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  pendingUploads: number = 0;

  constructor(
    public navCtrl: NavController,
    private settingsService: SettingsService  
  ) {

  }

}
