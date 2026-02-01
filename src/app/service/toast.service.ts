import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private toast: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    show():void{
        setTimeout(() => {
        this.toast.next(true);
        }, 100);
    }

    hide():void{
        setTimeout(() => {
        this.toast.next(false);
        }, 100);
    }
    
    get toast$(): Observable<boolean> {
        return this.toast.asObservable();
    }
}