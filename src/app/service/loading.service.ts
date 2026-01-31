 // loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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