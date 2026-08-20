import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/authInterceptor/auth.interceptor';
import { loaderInterceptor } from './core/interceptors/loaderInterceptor/loader-interceptor-interceptor';
import { locationContextInterceptor } from './core/interceptors/location-context.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor, locationContextInterceptor, loaderInterceptor])),
  ],
};
