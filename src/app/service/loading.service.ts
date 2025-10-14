 // loading.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
    private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    show():void{
        setTimeout(() => {
        this._loading.next(true);
        }, 100);
    }

    hide():void{
        setTimeout(() => {
        this._loading.next(false);
        }, 100);
    }
    
    get loading$(): Observable<boolean> {
    return this._loading.asObservable();
  }
}