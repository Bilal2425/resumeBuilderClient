import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormComponent } from './form/form.component';
import { AuthService } from './services/auth.service';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'resume-builder', component: FormComponent, canActivate: [authGuard]
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]
    }
];
