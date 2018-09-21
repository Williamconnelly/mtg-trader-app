import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { EditListComponent } from './edit-list/edit-list.component'; 
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GatheringComponent } from './gathering/gathering.component';
import { ViewListComponent } from './view-list/view-list.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';
import { ViewCollectionComponent } from './view-collection/view-collection.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/signup',
    pathMatch: 'full'
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
    path:'edit-list',
    component: EditListComponent
  },
  {
    path:'edit-collection',
    component: EditCollectionComponent
  },
  {
    path: 'view-list',
    component: ViewListComponent
  },
  {
    path: 'view-collection',
    component: ViewCollectionComponent
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
