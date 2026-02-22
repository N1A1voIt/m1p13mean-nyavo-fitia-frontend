import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { shopInterceptor } from './core/interceptors/shop.interceptor';

import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AuthService } from './core/services/auth.service';

/**
 * Factory to initialise Auth on startup.
 */
export function initializeAppFactory(authService: AuthService) {
  return () => authService.initialiseAuth();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, shopInterceptor, errorInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService],
      multi: true,
    }
  ]
};
