import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';

import { StorageService } from './storageService';
import { SettingsService } from './settingsService';
import { survey } from '../config/survey';

@Injectable()
export class UploadService {
    
    private url: string = "https://anysource.validar.com/WebServices/V2/Core/JSONSubmitResult.aspx?_JO=JSONP_CALLBACK";

    constructor(
        private http: Http,
        //private jsonp: Jsonp,
        private storageService: StorageService,
        private settingsService: SettingsService
    ) {

    }

    // Upload Pending Records
    public uploadPending() {
        let urlArray = [];
        this.storageService.getPendingRecords().then((data) => {
            
            // Get URLs
            data.forEach((registrant) => {
                urlArray.push({
                    link: this.convertPersonToUrl(registrant.survey),
                    id: registrant.survey.qrRegId
                });
            });
            return urlArray;
        }).then((urlList) => {
            
            // Start Uploading
            console.log(urlList);
        });

        // then.. close loading?, show alert?
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
}