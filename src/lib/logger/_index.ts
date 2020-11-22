import { Console } from './console';

class LoggerFactory {
  public getLogger() {
    return new Console();
  }
}

export const logger = new LoggerFactory().getLogger();
