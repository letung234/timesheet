import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

// Tạo thư mục logs nếu chưa tồn tại
const logDir = path.resolve(__dirname, '../../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Winston cấu hình ghi log ra file
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
  ],
});

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    logger.info(`➡️ Request: ${method} ${url}`);
    logger.info(
      `📦 Body: ${JSON.stringify(body)} | 📄 Query: ${JSON.stringify(query)} | 🧩 Params: ${JSON.stringify(params)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const ms = Date.now() - now;
        logger.info(`⬅️ Response: ${method} ${url} - ${ms}ms`);
      }),
    );
  }
}
