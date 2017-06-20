import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';

import { SettingsService } from '../../providers/settingsService';
import { pickManyValidator } from '../../helpers/pickManyValidator';
import { survey } from '../../config/survey';

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html'
})
export class CapturePage {
  
  editFlag: boolean = false;
  saveText: string = "Save Record";

  surveyObj: Array<any> = [];
  recordForm: FormGroup;
  requiredFields: Array<string> = [];

  constructor(
    public navCtrl: NavController,
    private settingsService: SettingsService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.surveyObj = survey;
    this.recordForm = this.formBuilder.group(this.createFreshForm(this.surveyObj));
  }

  ionViewWillEnter() {
    console.log('entering...');
  }

  // Create a fresh form object to capture data
  createFreshForm(survey) {
    let formObj = {};
    survey.forEach((question) => {
      formObj[question.tag] = this.determineValidation(question);
    });

    // Generate RegID
    formObj['qrRegId'] = UUID.UUID();
    formObj['qrDeviceId'] = this.settingsService.getDeviceId();
    formObj['qrBoothRep'] = this.settingsService.boothRep;
    formObj['qrBoothStation'] = this.settingsService.boothStation;
    return formObj;
  }

  // Create Validation / beginning value array per question
  determineValidation(ques) {
    let validateArr = <any>[];
    if (ques.type === 'TEXT' || ques.type === 'TEXTAREA') {
      validateArr.push('');
      if (ques.required) {
        this.requiredFields.push(ques);
        validateArr.push(Validators.required);
      }    
    } else if (ques.type === 'PICKONE') {
      validateArr.push('');
      if (ques.required) {
        this.requiredFields.push(ques);
        validateArr.push(Validators.required);
      }
    } else if (ques.type === 'PICKMANY') {
      validateArr.push([]);
      if (ques.required) {
        this.requiredFields.push(ques);
        validateArr.push(Validators.compose([Validators.required, pickManyValidator]));
      }
    } else if (ques.type === 'CHECKBOX') {
      validateArr.push(false);
      if (ques.required) {
        this.requiredFields.push(ques);
        validateArr.push(Validators.pattern('true'));
      }
    }
    return validateArr;
  }

  // Save new lead or edited lead
  saveRecord() {
    const invalid = this.checkValidity(this.requiredFields, this.recordForm.value);
    if (invalid) {
      let toast = this.toastCtrl.create({
        message: `${invalid} is a required field.`,
        duration: 2500,
        position: 'top',
        cssClass: 'notify-error'
      });
      toast.present();
      return false;
    }
  }

  // Check for form validation
  checkValidity(req, form) {
    let i = 0, j = req.length;
    for(; i < j; i++) {
      if (req[i].tag === 'qrEmail' && form['qrEmail'].indexOf('@') === -1) {
        return req[i].prompt;
      }
      if ((req[i].type === 'TEXT' || req[i].type === 'TEXTAREA' || req[i].type === 'PICKONE') && !form[req[i].tag]) {
        return req[i].prompt;
      } else if (req[i].type === 'PICKMANY' && form[req[i].tag].length === 0) {
        return req[i].prompt;
      } else if (req[i].type === 'CHECKBOX' && !form[req[i].tag]) {
        return req[i].prompt;
      }
    }
    return false;
  }

  // TESTING
  logForm() {
    console.log(this.recordForm);
  }
}
