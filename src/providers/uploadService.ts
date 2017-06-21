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
        private jsonp: Jsonp,
        private storageService: StorageService,
        private settingsService: SettingsService
    ) {

    }

    // Upload Pending Records
    public uploadPending() {

    }

    // Convert survey form to POST Url
    private convertPersonToUrl(person) {
        let surveyQuestions = "",
            fullUrl = "",
            resultKey = "",
            configStr = `&_OG=${this.settingsService.orgGuid}&_LSG=${this.settingsService.lsgGuid}`;

        survey.forEach((question) => {

        });
        resultKey = `&_RK=${encodeURIComponent(person.qrRegId)}`;
        surveyQuestions += `&qrRegId=${encodeURIComponent(person.qrRegId)}`;
        surveyQuestions += `&qrCreateDateTime=${encodeURIComponent(person.qrCreateDateTime)}`;
        surveyQuestions += `&qrEditDateTime=${encodeURIComponent(person.qrEditDateTime)}`;
        surveyQuestions += `&qrDeviceId=${encodeURIComponent(person.qrDeviceId)}`;

        fullUrl = `${this.url}${configStr}${resultKey}` + (this.settingsService.settings.overwriteRecords) ? '&_AA=0' : '&_AA=1';
        fullUrl += `${surveyQuestions}&_C=1`;
        return fullUrl;
    }
}