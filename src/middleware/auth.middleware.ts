import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as _ from 'lodash';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    if (!_.isString(req.headers['x-api-key'])) {
      throw new HttpException('Not authorised', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
