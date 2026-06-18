import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';



export function tokenGetter(){
  return localStorage.getItem('jwtToken');
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch()),

    //Adding jwt module to handle tokens
    importProvidersFrom(JwtModule.forRoot(
      {
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:7216'],
          disallowedRoutes: [
            'https://localhost:7216/api/User/login',
            'https://localhost:7216/api/User/register'
          ],
        }

      }
    ))
  ]
};
