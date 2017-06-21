import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';

import { SettingsService } from '../../providers/settingsService';
import { StorageService } from '../../providers/storageService';
import { pickManyValidator } from '../../helpers/pickManyValidator';
import { survey } from '../../config/survey';

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html'
})
export class CapturePage {
  @ViewChild(Content) contentPage : Content;

  editFlag: boolean = false;

  surveyObj: Array<any> = [];
  recordForm: FormGroup;
  requiredFields: Array<string> = [];

  constructor(
    public navCtrl: NavController,
    private settingsService: SettingsService,
    private storageService: StorageService,
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
    formObj['qrRegId'] = UUID.UUID();
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

  // Save Edits
  saveEdits() {

  }

  // Save new lead
  saveNewRecord() {

    // Check if valid
    const invalid = this.checkValidity(this.requiredFields, this.recordForm.value);
    if (invalid) {
      let toast = this.toastCtrl.create({
        message: `${invalid} is a required field.`,
        duration: 2500,
        position: 'top',
        cssClass: 'notify-error'
      });
      toast.present();
      this.scrollToTop();
      return false;
    }

    // Include extra fields
    const thisForm = this.recordForm.value;
    thisForm['qrDeviceId'] = this.settingsService.settings.deviceId;  
    thisForm['qrBoothRep'] = this.settingsService.settings.boothRep;
    thisForm['qrBoothStation'] = this.settingsService.settings.boothStation;

    console.log(thisForm);
    const person = this.createPerson(thisForm);
    this.storageService.savePerson(person).then((data) => {
      let toast = this.toastCtrl.create({
        message: `New record saved!`,
        duration: 2500,
        position: 'top'
      });
      this.recordForm = this.formBuilder.group(this.createFreshForm(this.surveyObj));
      toast.present();      
      this.scrollToTop();   
    }).catch((err) => {
      let toast = this.toastCtrl.create({
        message: 'There was an issue saving this record..',
        duration: 2500,
        position: 'top', 
        cssClass: 'notify-error'
      });
      toast.present();
    });
  }

  // Create person to save
  createPerson(form) {
    const person = {
      uploaded: false,
      deleted: false,
      survey: form
    };
    return person;
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

  // DOM Helper - go to top of page
  scrollToTop() {
    this.contentPage.scrollToTop();
  }

  // TESTING
  logForm() {
    console.log(this.recordForm);
  }

  getPerson() {
    this.storageService.getAllRecords().then((data) => {
      console.log(data);
    }).catch((err) => console.log(err));
  }
}
