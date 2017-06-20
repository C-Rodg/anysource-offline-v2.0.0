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
    
    public deviceId: string = "";
    public boothRep: string = "";
    public boothStation: string = "";
    public overwriteRecords: boolean = true;
    public orgGuid: string = "";
    public lsgGuid: string = "";

    constructor(
        private alertCtrl: AlertController
    ) {        
        this.setOrCreateDeviceId();
        this.checkForCreds();
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

    // Set or Create a new device Id
    setOrCreateDeviceId() {
        let deviceId = window.localStorage.getItem('deviceId');
        if (!deviceId) {
            this.deviceId = UUID.UUID();
            window.localStorage.setItem('deviceId', this.deviceId);
        } else {
            this.deviceId = deviceId;
        }
        return this.deviceId;
    }

    // Get Device ID
    getDeviceId() {
        if (this.deviceId) {
            return this.deviceId;
        } else {
            return this.setOrCreateDeviceId();
        }
    }

}