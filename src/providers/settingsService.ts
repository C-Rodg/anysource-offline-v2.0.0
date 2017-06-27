import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';

// Helper - Parse out query string parameters (lsg, org)
function getQueryStringObj() {
    let query = window.location.search.substr(1);
    let result = {};
    query.split('&').forEach((part) => {
        let item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}

@Injectable()
export class SettingsService {
    
    public orgGuid: string = "";
    public lsgGuid: string = "";

    public settings = {
        deviceId: "",
        boothRep: "",
        boothStation: "",
        overwriteRecords: true,
        backgroundUploadWait: 8        
    }

    constructor(
        private alertCtrl: AlertController
    ) {        
        this.checkForCreds();
        this.loadSettings();
    }

    // Check for Org & Lsg
    checkForCreds() {
        const querys = getQueryStringObj();
        if (querys['lsg'] && querys['org']) {
            this.orgGuid = querys['org'];
            this.lsgGuid = querys['lsg'];
        } else {
            let alert = this.alertCtrl.create({
                title: "Insufficient Credentials",
                subTitle: "Please check your URL's leadsource and organization guid parameters and try again.",
                buttons: ['Dismiss']
            });
            alert.present();
        }
    }

    // Load settings object
    loadSettings() {
        const settings = window.localStorage.getItem('validar_settings');
        if (settings) {
            const settingsObj = JSON.parse(settings);        
            if (!settingsObj.deviceId) {
                settingsObj.deviceId = UUID.UUID();
            }
            if (!settingsObj.hasOwnProperty('overwriteRecords')) {
                settingsObj.overwriteRecords = true;
            }
            if (!settingsObj.hasOwnProperty('backgroundUploadWait')) {
                settingsObj.backgroundUploadWait = 8;
            }
            this.settings = settingsObj;            
            this.saveSettingsToLocal();
        } else {
            if (!this.settings.deviceId) {
                this.settings.deviceId = UUID.UUID();
            }
            this.saveSettingsToLocal();
        }
    }

    // Save settings to local storage
    saveSettingsToLocal() {
        const settingsStr = JSON.stringify(this.settings);
        window.localStorage.setItem('validar_settings', settingsStr);
    }

}