import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { constants } from './../utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public http: HttpClient) { }

  /*function for calling get Apis's*/
  get(url) {
    let headers = new HttpHeaders()
    headers = headers.append('content-type', 'application/json')
    headers = headers.append('content-type', 'application/x-www-form-urlencoded')
    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);
    const finalUrl = constants.apiBaseURL + url;
    // headers = headers.append('customer-header', 'custom')
    return this.http.get<any[]>(finalUrl, { 'headers': headers }).pipe(
      map((data) => {
        //You can perform some transformation here
        return data;
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    )
  }

  /*function for calling post Apis's*/
  post(url, body) {
    let headers = new HttpHeaders()
   // headers = headers.append('content-type', 'application/json')
   // headers = headers.append('content-type', 'application/x-www-form-urlencoded')
    // headers = headers.append('customer-header', 'custom')
    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);
    const finalUrl = constants.apiBaseURL + url;
    let value: HttpParams = new HttpParams();
    if (body) {
      Object.keys(body).forEach(key => {
        value = value.append(key, body[key]);
      });
    }
    return this.http.post(finalUrl, body, { 'headers': headers })
      .pipe(
        map((data) => {
          console.log("..........",data)
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )
  }

  postPdf(url, body): Observable<any>{
    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    return this.http
      .post(constants.apiBaseURL + url, body,
        {
          headers: {token},
          responseType: 'arraybuffer'
        }
      );
  }

  /*function for calling put Apis's*/
  put(url, body) {
    let headers = new HttpHeaders()
    // headers = headers.append('content-type', 'application/json')
    // headers = headers.append('content-type', 'application/x-www-form-urlencoded')
    // headers = headers.append('customer-header', 'custom')
    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);

    const finalUrl = constants.apiBaseURL + url;

    let value: HttpParams = new HttpParams();
    if (body) {
      Object.keys(body).forEach(key => {
        value = value.append(key, body[key]);
      });
    }
    return this.http.put(finalUrl, body, { 'headers': headers })
      .pipe(
        map((data) => {
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )

  }

  /*function for calling patch Apis's*/
  patch(url, body) {
    let headers = new HttpHeaders()
    // headers = headers.append('content-type', 'application/json')
    // headers = headers.append('content-type', 'application/x-www-form-urlencoded')

    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);

    const finalUrl = constants.apiBaseURL + url;

    // headers = headers.append('customer-header', 'custom')
    let value: HttpParams = new HttpParams();
    if (body) {
      Object.keys(body).forEach(key => {
        value = value.append(key, body[key]);
      });
    }
    return this.http.patch(finalUrl, body, { 'headers': headers })
      .pipe(
        map((data) => {
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )

  }


  /*function for calling delete Apis's*/
  delete(url, id: string) {
    let headers = new HttpHeaders()
    // headers = headers.append('content-type', 'application/json')
    // headers = headers.append('content-type', 'application/x-www-form-urlencoded')

    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);

    const finalUrl = constants.apiBaseURL + url+'/';

    return this.http.delete(finalUrl+id, { 'headers': headers })
      .pipe(
        map((data) => {
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )

  }
  postFile(url, body) {
    let headers = new HttpHeaders()

    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);
    const finalUrl = constants.apiBaseURL + url;
    let value: HttpParams = new HttpParams();
    if (body) {
      const formData: FormData = new FormData();
    formData.append('fileKey', body.fileToUpload,body.fileToUpload.name);
    }
    return this.http.post(finalUrl, body, { 'headers': headers })
      .pipe(
        map((data) => {
          console.log("..........",data)
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )
  }

}
