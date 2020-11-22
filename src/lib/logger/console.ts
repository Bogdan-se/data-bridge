import { AbstractLogger } from './abstract';

export class Console extends AbstractLogger {
  log(message: string) {
    return console.log(message);
  }

  warn(message: string) {
    return console.warn(message);
  }

  error(message: string) {
    return console.error(message);
  }
}
