import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from 'rxjs/internal/operators/catchError';

// 这个实际上是一个服务

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
    // req就是发起的请求
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // clone就是复制传入的req请求
        return next.handle(req.clone({
            //  这里加入一个新的属性, 之后通过return出去，这样就相当于是经历了一次拦截
            // 这里除了这样之外，可以在 头部添加任何的信息都可以
            //  现在每一个接口都会携带下面的属性
            withCredentials:true
        })).pipe(catchError(this.handleError));
    }

    // 这里就是拦截器的另外一个功能，统一处理错误的信息
    // 这里的参数error就是member-card.component中 onSignin中的 error
    private handleError(error: HttpErrorResponse): never {
        throw error.error;
    }
}
