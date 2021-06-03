import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuardService {

  constructor(private _router: Router) { }

  /*Check Routing states*/
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    console.log('state url', state.url)

    if (state.url === '/login'  || state.url === '/register') {
      if (this.isLoggedIn()) {
        this._router.navigate(["quickAccess"]);
        return true;
      }
    }
    else if( state.url.includes('note-share')){
      return true;
    }
    else if( state.url.includes('reset-password')){
      return true;
    }
    else {
      if (this.isLoggedIn()) {
        return true;
      } else {
        console.log("check")
        this._router.navigate(["login"]);
        return false;
      }
    }
    return true;
  }

  /*Check user is authorized or not*/
  isLoggedIn(): boolean {
    let token = localStorage.getItem('token')
    if (token && token !== undefined) {
      return true;
    } else {
      return false;
    }
  }

}
