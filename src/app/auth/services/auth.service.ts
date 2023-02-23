import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { AuthResponse, Usuario } from '../interfaces/auth.interface';
import { catchError, map, of, tap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() { return { ...this._usuario } }


  constructor(private http: HttpClient) { }



  //register
  register(name: string, email: string, password: string) {
    const url = `${this.baseUrl}/auth/new`
    const body = { name, email, password }
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => { if (resp.ok) this.setAuth(resp) }),
        map(resp => resp.ok),
        catchError(err => of(err.error.msg))
      )
  }


  login(email: string, password: string) {
    const url = `${this.baseUrl}/auth`
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => {
          if (resp.ok) {
            this.setAuth(resp)
          }
        }),
        map(res => res.ok),
        catchError(err => of(err.error.msg))
      );
  }//end login



  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('JWT') || '')
    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map(resp => {
          this.setAuth(resp);
          return resp.ok
        }),
        catchError(err => of(false))

      )
  }//end validarToken

  setAuth(authresponse: AuthResponse) {
    localStorage.setItem('JWT', authresponse.token!)
    this._usuario = {
      uid: authresponse.uid!,
      name: authresponse.name!,
      email: authresponse.email!,
    }
  }
  logout() {
    localStorage.removeItem('JWT');
  }
}
