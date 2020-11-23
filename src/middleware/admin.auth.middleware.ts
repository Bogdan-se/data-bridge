import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as _ from "lodash";

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!_.isString(req.headers.authorization)) {
      throw new HttpException('Not authorised', HttpStatus.UNAUTHORIZED);
    }
    const [, base64Credentials] = req.headers.authorization.split(' ');
    const credentials = Buffer.from(base64Credentials, 'base64').toString();
    const [username, password] = credentials.split(':');

    if (username !== process.env.ADMIN_NAME || password !== process.env.ADMIN_PASSWORD) {
      throw new HttpException('Not authorised', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
