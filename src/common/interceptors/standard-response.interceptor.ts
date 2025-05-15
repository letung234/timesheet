import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  timestamp: string;
}

@Injectable()
export class StandardResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        statusCode: response.statusCode,
        data: data?.data ?? data,
        message: data?.message ?? undefined,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
