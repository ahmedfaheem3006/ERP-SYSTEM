import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardSec1Component } from './dashboard-sec1/dashboard-sec1.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardSec2Component } from './dashboard-sec2/dashboard-sec2.component';
import { DashboardSec3Component } from './dashboard-sec3/dashboard-sec3.component';
import { DashboardSec4Component } from './dashboard-sec4/dashboard-sec4.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerificationComponent } from './verification/verification.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardSec1Component,
    NavbarComponent,
    FooterComponent,
    DashboardSec2Component,
    DashboardSec3Component,
    DashboardSec4Component,
    ForgotPasswordComponent,
    VerificationComponent,
    NewPasswordComponent,
    ConfirmationComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
