import { Injectable } from '@angular/core';
import * as localforage from 'localforage';

@Injectable()
export class StorageService {
    constructor() {
        localforage.config({
            name: 'validar'
        });
    }

    // Save person to DB, using RegId as key
    savePerson(person: any): Promise<any> {
        return localforage.setItem(person.survey.qrRegId, person);
    }

    // Get Person by RegId
    getRecord(regId: string): Promise<any> {
        return localforage.getItem(regId);
    }

    // Delete Record
    deleteRecord(regId: string): Promise<any> {
        return localforage.removeItem(regId);
    }

    // Get All Records
    getAllRecords(): Promise<any> {
        let people = [];
        return new Promise((resolve, reject) => {
            localforage.iterate((val, key, i) => {
                if(val.hasOwnProperty('survey')) {
                    people.push(val);
                }
            }).then(() => {
                resolve(people);
            });
        });
    }

    // Get Pending Records
    getPendingRecords(): Promise<any> {
        let people = [];
        return new Promise((resolve, reject) => {
            localforage.iterate((val, key, i) => {
                if (val.hasOwnProperty('survey') && !val.uploaded) {
                    people.push(val);
                }
            }).then(() => {
                resolve(people);
            });
        });
    }       
}