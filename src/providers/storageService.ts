import { Injectable } from '@angular/core';
import * as localforage from 'localforage';

@Injectable()
export class StorageService {
    constructor() {
        localforage.config({
            name: 'validar'
        });
    }

    saveData(data: any): Promise<any> {
        return localforage.setItem('test_person2', data);
    }
}