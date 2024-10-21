import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const date = new Date();
    const dateString = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const fullDate = `${dateString}.${month}.${year}`;
    const fullTime = `${hours}:${minutes}:${seconds}`;
    const userAgent = req.headers['user-agent'];
    console.log(
      `[${fullDate} | ${fullTime}] METHOD: ${req.method}, URL: ${req.originalUrl}, USERAGENT: ${userAgent}`,
    );
    next();
  }
}
