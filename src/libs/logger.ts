class ConsoleLogger {
  public info(...args: any[]) {
    console.info(args);
    return args;
  }
  public warn(...args: any[]) {
    console.warn(args);
    return args;
  }

  public error(...args: any[]) {
    console.error(args);
    return args;
  }
}

export const logger = new ConsoleLogger();
