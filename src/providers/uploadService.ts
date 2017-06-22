import { Injectable } from '@angular/core';
import { Http, Jsonp, JsonpModule} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { StorageService } from './storageService';
import { SettingsService } from './settingsService';
import { survey } from '../config/survey';

@Injectable()
export class UploadService {
    
    //private url: string = "https://anysource.validar.com/WebServices/V2/Core/JSONSubmitResult.aspx?_JO=JSONP_CALLBACK";  // CALLSBACK ANGULAR OBJECT
    private url: string = "https://anysource.validar.com/WebServices/V2/Core/JSONSubmitResult.aspx?_JO=validarCallback";
    private urlArray = [];
    private errorArray = [];

    constructor(
        private http: Http,
        private jsonp: Jsonp,
        private storageService: StorageService,
        private settingsService: SettingsService,
    ) {
        
        (<any>window).validarCallback.__submitComplete = this.handleResponse.bind(this);
    }    

    // Create URL arrays, send first request
    public uploadRecords(records) {
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
        this.makeRequest(url.link).then((data) => {
            console.log("MADE A REQUEST");
            console.log(data);
        })
        .catch((err) => {
            console.log("Made a Request??-error");
            console.log(err);
        });
    }

    // Handle Validar Response
    private handleResponse(success, msg) {
        console.log("VALIDAR CALLBACK");
        
        // Mark as uploaded
        if (success) {
            this.storageService.markUploaded(this.urlArray[0].person)
            .then(() => {
                this.urlArray.shift();
                if (this.urlArray.length > 0) {
                    this.sendRequest(this.urlArray[0].link);
                } else {
                    // ALL DONE!.. alert done + any errors?
                }
            })
            .catch((err) => {
                this.errorArray.push(err);
                this.urlArray.shift();
                if (this.urlArray.length > 0) {
                    this.sendRequest(this.urlArray[0].link);
                } else {
                    // ALL DONE!.. alert done + errors?
                }
            });
        } else {
            // make a note about an error and continue
            this.errorArray.push(msg);
            this.urlArray.shift();
            if (this.urlArray.length > 0) {
                this.sendRequest(this.urlArray[0].link);
            } else {
                // ALL DONE!.. alert done + errors
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

    // Make request
    private makeRequest(url) {
        console.log('making request..');
        return this.jsonp.request(url).map(res => res.json()).toPromise().catch((err) => {
            console.log(err);
            console.log("Each Request will hit this...");
        });
    }  
}