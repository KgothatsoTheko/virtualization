import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serverUrl = 'http://localhost:1717'

  constructor(private http: HttpClient) { }

  genericPost(endpoint:any, body:any) {
    this.http.post(this.serverUrl + endpoint, body)
  }

  genericGet(endpoint: string){
    return this.http.get(this.serverUrl+endpoint)
  }

  genericDelete(endpoint: string){
    return this.http.delete(this.serverUrl+endpoint)
  }

  genericUpdate(endpoint: any, body: any){
    return this.http.post(this.serverUrl + endpoint, body)
  }

  get(key: string, sessionType: string): any {
    let data = sessionType === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key);
    return data ? JSON.parse(data) : data;
  }
}
