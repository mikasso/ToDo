import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';
import { ModalComponent } from '../modal-component/modal-component.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login-services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.authService.token;
    if (!authToken)
      return next.handle(req);
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe( tap(
      () => { },
      err => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse): void {
    var errorMessage: string = "Error occured during connection with server";
    switch (error.status) {
      case 401: errorMessage = "Unauthorized access, please login again"; break;
      case 500: errorMessage = "Internal server error, we are sorry!"; break;
      case 404: errorMessage = "Resource doesn't exist, we are sorry!"; break;
    }
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = errorMessage;
    if (error.status == 401 && this.authService.isLogged) {//if someone claimed he is logged in display error
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

}
