import { Routes, RouterModule } from '@angular/router';
import { Registration } from './registration/registration';
import { Login } from './login/login';
import { Home } from './home/home';
import { BlogList } from './blog-list/blog-list';
import { CreateBlog } from './create-blog/create-blog';
import { ViewBlog } from './view-blog/view-blog';
import { ExploreBlog } from './explore-blog/explore-blog';

export const routes: Routes = [
    { path: 'explore-blogs', component: ExploreBlog },
    { path: 'register', component: Registration },
    { path: 'login', component: Login },
    { path: 'blog-list/:userId', component: BlogList },
    { path: 'create-blog/:userId', component: CreateBlog },
    { path: 'view-blog/:userId/:blogId', component: ViewBlog },
    { path: '', component: Home },
    { path: '**', redirectTo: '' }
];
