import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { EditListComponent } from './edit-list/edit-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GatheringComponent } from './gathering/gathering.component';
import { ViewListComponent } from './view-list/view-list.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'gathering',
    component: GatheringComponent
  },
  {
    path: 'edit-list',
    component: EditListComponent
  },
  {
    path: 'view-list',
    component: ViewListComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
