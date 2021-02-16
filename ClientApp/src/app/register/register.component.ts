import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from './../login-services';
import { RegisterRequest } from '../models/RegisterRequest';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  registerError = false;
  errorMsg = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      login: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  get registerRequest() {
    var request = new RegisterRequest();
    request.name = this.registerForm.controls['name'].value;
    request.login = this.registerForm.controls['login'].value;
    request.email = this.registerForm.controls['email'].value;
    request.password = this.registerForm.controls['password'].value;
    return request;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.clearError();

    this.userService.register(this.registerRequest)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        },
        error => {
          this.setError(error);
        });
  }

  clearError() {
    this.loading = true;
    this.registerError = false;
    this.errorMsg = "";
  }

  setError(error) {
    this.loading = false;
    this.registerError = true;
    this.errorMsg = "Error occured during registration. " + error.error;
  }
}
