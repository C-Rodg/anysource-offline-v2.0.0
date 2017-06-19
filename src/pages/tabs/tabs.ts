import { Component } from '@angular/core';

import { CapturePage } from '../capture/capture';
import { ListPage } from '../list/list';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CapturePage;
  tab2Root = ListPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
