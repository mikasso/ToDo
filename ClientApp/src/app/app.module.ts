import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TasksToDoComponent } from './tasks-to-do/tasks-to-do.component';
import { LoginComponent } from './login-view/login-view.component';
import { RegisterComponent } from './register/register.component';
import { AuthInterceptor } from './login-services/authintercept.service';
import { TasksFilterComponent } from './tasks-to-do/filter/tasks-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    TasksFilterComponent,
    TasksToDoComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
    { path: '', component: TasksToDoComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
], { relativeLinkResolution: 'legacy' })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
