import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from 'src/lib/logger/_index';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    logger.log(`Headers: ${JSON.stringify(req.headers)}`);
    logger.log(`Query: ${JSON.stringify(req.query)}`);
    logger.log(`Body: ${JSON.stringify(req.body)}`);
    next();
  }
}
