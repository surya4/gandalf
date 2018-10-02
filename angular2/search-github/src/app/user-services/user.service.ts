import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  private url = 'http://api.github.com/users/';
  private username: string;
  private client_id = 'c5305a21681fb64449a4';
  private client_sec = 'a1543716f3b892b9ea299fa2701d0aab64df9e65';
  // queryString = ''

  constructor(private http: Http) {
    this.username = 'surya4';
   }

  getUserData(){
    return this.http.get(this.url+this.username+'?client_id='+this.client_id+'&client_sec='+this.client_sec)
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getRepoData(){
    return this.http.get(this.url+this.username+'/repos?client_id='+this.client_id+'&client_sec='+this.client_sec)
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  updateUser(username: string){
    this.username = username;
  }

  private extractData(res: Response) {
  let body = res.json();
  return body.data || {  };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
