import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastConfig } from '../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private toast: BehaviorSubject<ToastConfig> = new BehaviorSubject<ToastConfig>({show: false});
    
    show(config: Omit<ToastConfig, 'show'>):void{
        setTimeout(() => {
        this.toast.next({...config, show: true});
        }, 100);
    }

    hide():void{
        setTimeout(() => {
        this.toast.next({show: false});
        }, 100);
    }
    
    get toast$(): Observable<ToastConfig> {
        return this.toast.asObservable();
    }
}