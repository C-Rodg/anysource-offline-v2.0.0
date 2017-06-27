import { Injectable } from '@angular/core';
import { Http, Jsonp, JsonpModule} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ToastController, Events } from 'ionic-angular';

import { StorageService } from './storageService';
import { SettingsService } from './settingsService';
import { survey } from '../config/survey';

@Injectable()
export class UploadService {
    
    //private url: string = "https://anysource.validar.com/WebServices/V2/Core/JSONSubmitResult.aspx?_JO=JSONP_CALLBACK";  // CALLSBACK ANGULAR OBJECT
    private url: string = "https://anysource.validar.com/WebServices/V2/Core/JSONSubmitResult.aspx?_JO=validarCallback";
    private urlArray = [];
    private errorArray = [];
    private showUploadToast: boolean = false;
    private backgroundInterval: any;

    constructor(
        private http: Http,
        private jsonp: Jsonp,
        private storageService: StorageService,
        private settingsService: SettingsService,
        private toastCtrl: ToastController,
        private ev: Events
    ) {        
        (<any>window).validarCallback.__submitComplete = this.handleResponse.bind(this);
    }    

    // Create URL arrays, send first request
    public uploadRecords(records) {
        this.showUploadToast = true;
        this.urlArray = [];
        this.errorArray = [];
        records.forEach((registrant) => {
            this.urlArray.push({
                link: this.convertPersonToUrl(registrant.survey),
                id: registrant.survey.qrRegId,
                person: registrant
            });        
        });

        this.sendRequest(this.urlArray[0]);        
    }

    // Send request, eat errors..
    private sendRequest(url) {
        this.makeRequest(url.link).then((data) => {}).catch((err) => {});
    }

    private handleToast(errs) {
        if (this.showUploadToast) {
            const msg = (errs.length > 0) ? `Finished uploading with ${errs.length} errors` : `Finished uploading records!`;
            let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                position: 'top'
            });
            toast.present();
            this.showUploadToast = false;            
        }
        this.ev.publish('update:pending');
    }

    // Handle Validar Response
    handleResponse(success, msg) {
        // Mark as uploaded
        if (success) {
            this.storageService.markUploaded(this.urlArray[0].person)
            .then(() => {
                this.urlArray.shift();
                if (this.urlArray.length > 0) {
                    this.sendRequest(this.urlArray[0]);
                } else {
                    this.handleToast(this.errorArray);
                }
            })
            .catch((err) => {
                this.errorArray.push(err);
                this.urlArray.shift();
                if (this.urlArray.length > 0) {
                    this.sendRequest(this.urlArray[0]);
                } else {
                    this.handleToast(this.errorArray);
                }
            });
        } else {
            // make a note about an error and continue
            this.errorArray.push(msg);
            this.urlArray.shift();
            if (this.urlArray.length > 0) {
                this.sendRequest(this.urlArray[0]);
            } else {
                this.handleToast(this.errorArray);
            }
        }        
    }

    // Convert survey form to POST Url
    private convertPersonToUrl(person) {
        let surveyQuestions = "",
            fullUrl = "",
            resultKey = "",
            configStr = `&_OG=${this.settingsService.orgGuid}&_LSG=${this.settingsService.lsgGuid}`;

        // Survey Data
        survey.forEach((question) => {
            if ((question.type === 'TEXT' || question.type === 'TEXTAREA') && person[question.tag]) {
                surveyQuestions += `&${question.tag}=${encodeURIComponent(person[question.tag])}`;
            } else if (question.type === 'PICKONE' && person[question.tag]) {
                surveyQuestions += `&${person[question.tag]}=1`;
            } else if (question.type === 'PICKMANY' && person[question.tag] && person[question.tag].length > 0) {
                person[question.tag].forEach((answer) => {
                    surveyQuestions += `&${answer}=1`;
                });
            } else if (question.type === 'CHECKBOX' && person[question.tag]) {
                surveyQuestions += `&${question['options'][0].tag}=1`;
            }
        });

        // Extra Fields
        resultKey = `&_RK=${encodeURIComponent(person.qrRegId)}`;
        surveyQuestions += `&qrRegId=${encodeURIComponent(person.qrRegId)}`;
        surveyQuestions += `&qrCreateDateTime=${encodeURIComponent(person.qrCreateDateTime)}`;
        surveyQuestions += `&qrEditDateTime=${encodeURIComponent(person.qrEditDateTime)}`;
        surveyQuestions += `&qrDeviceId=${encodeURIComponent(person.qrDeviceId)}`;

        surveyQuestions += person.qrBoothRep ? `&qrBoothRep=${encodeURIComponent(person.qrBoothRep)}` : "";
        surveyQuestions += person.qrBoothStation ? `&qrBoothStation=${encodeURIComponent(person.qrBoothStation)}` : '';

        // Form URL
        fullUrl = `${this.url}${configStr}${resultKey}`;
        fullUrl += (this.settingsService.settings.overwriteRecords) ? '&_AA=0' : '&_AA=1';
        fullUrl += `${surveyQuestions}&_C=1`;
        return fullUrl;
    }

    // Make request and eat the error
    private makeRequest(url) {
        return this.jsonp.request(url).map(res => res.json()).toPromise().catch((err) => {});
    }  

    // Start new background upload time
    initializeBackgroundUpload(mins) {
        clearInterval(this.backgroundInterval);
        if (mins === 0) {
            return false;
        }
        const time = mins * 60 * 1000;
        this.backgroundInterval = setInterval(() => {
            this.backgroundUpload();
        }, time);
    }

    // Upload in the background
    private backgroundUpload() {
        if (!window.navigator.onLine) {
            return false;
        }
        this.storageService.getPendingRecords().then((data) => {
            if (data && data.length > 0) {
                this.startBackgroundUpload(data);
            }
        });
    }

    private startBackgroundUpload(records) {        
        this.urlArray = [];
        this.errorArray = [];
        records.forEach((registrant) => {
            this.urlArray.push({
                link: this.convertPersonToUrl(registrant.survey),
                id: registrant.survey.qrRegId,
                person: registrant
            });        
        });

        this.sendRequest(this.urlArray[0]); 
    }
}