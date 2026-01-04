import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const username = 'user';
  const password = '14b96ac3-0684-4d11-bd6c-9cc87f3ffa97';

  const authToken = btoa(`${username}:${password}`);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Basic ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  return next(authReq);
};
