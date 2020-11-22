export abstract class AbstractLogger {
  abstract log(message: string): void;
  abstract warn(message: string): void;
  abstract error(message: string): void;
}
