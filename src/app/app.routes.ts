import { Routes, RouterModule } from '@angular/router';
import { Registration } from './registration/registration';
import { Login } from './login/login';
import { Home } from './home/home';
import { BlogList } from './blog-list/blog-list';

export const routes: Routes = [
    { path: 'register', component: Registration },
    { path: 'login', component: Login },
    { path: 'blog-list/:userId', component: BlogList },
    { path: '', component: Home },
    { path: '**', redirectTo: '' }
];
