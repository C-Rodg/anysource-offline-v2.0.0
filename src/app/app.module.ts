import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { MyApp } from './app.component';

import { CapturePage } from '../pages/capture/capture';
import { ListPage } from '../pages/list/list';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { TextInput, TextArea, PickoneInput, PickmanyInput, CheckboxInput } from '../pages/form-items/';

import { StorageService } from '../providers/storageService';
import { SettingsService } from '../providers/settingsService';
import { UploadService } from '../providers/uploadService';

@NgModule({
  declarations: [
    MyApp,
    CapturePage,
    ListPage,
    SettingsPage,
    TabsPage,
    TextInput,
    TextArea,
    PickoneInput,
    PickmanyInput,
    CheckboxInput
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      tabsHideOnSubPages: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CapturePage,
    ListPage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StorageService,
    SettingsService,
    UploadService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
