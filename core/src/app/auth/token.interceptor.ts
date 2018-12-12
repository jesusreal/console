import * as LuigiClient from '@kyma-project/luigi-client';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AppConfig } from './../app.config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  private isNewToken(): boolean {
    const now = Date.now();
    const maximumAgeInSeconds = 10;
    return (
      parseInt(sessionStorage.getItem('id_token_stored_at'), 10) >
      now - 1000 * maximumAgeInSeconds
    );
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(AppConfig.authIssuer)) {
      const token = LuigiClient.getEventData().idToken;
      console.log(`intercepting ${token}`);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          return err;
        }
      )
    );
  }
}
