import { Injectable } from "@angular/core";
import { environment } from "../../environment";
import { Observable, take } from "rxjs";
import { HttpClient } from "@angular/common/http";
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { ImportProgressData } from "../models/import.model";

@Injectable({
  providedIn: 'root'
})

export class ImportService {
  Url = environment;

  private hubConnection!: signalR.HubConnection;
  public progress$ = new BehaviorSubject<ImportProgressData | null>(null);
  authentication = JSON.parse(localStorage.getItem('authState') || 'null');

  constructor( private http: HttpClient) {
    this.connectToHub();
  }

  private connectToHub(){
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.Url.baseUrl}/importProgressHub`, {
      accessTokenFactory: () => this.authentication.bearerToken
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection
    .start()
    .then(() => console.log('Conectado com sucesso ao ImportProgressHub!'))
      .catch(err => console.error('Erro ao conectar ao SignalR:', err));

      this.hubConnection.on('ReceiveProgress', (data: ImportProgressData) => {
      this.progress$.next(data); 
    });
  }

  importSheet(file: File): Observable<any>{
    const formData = new FormData();
    formData.append("planilha",file);
    
    return this.http.post<any[]>(`${this.Url.worker}/worker/import`, formData).pipe(take(1))
  }
}