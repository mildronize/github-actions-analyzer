import fsPromise from 'node:fs/promises';
import { GithubActionsAnalyzer } from './github-actions-analyzer';
import { stringifyArrayToCsvRow } from './libs';
export interface CommandRunnerConfig {
  /**
   * Yaml File Config, using Format `IConfig`
   */
  file: string;

  output?: string;
}

export abstract class CommandRunner {
  public name?: string;

  protected file: Output;

  constructor(private config: CommandRunnerConfig, protected analyzer: GithubActionsAnalyzer) {
    this.file = new Output(config.output);
  }

  public abstract execute(): any;
}

class Output {
  constructor(protected outputFile: string | undefined) {}
  public async write(data: string) {
    if (this.outputFile === undefined) {
      throw new Error(`Arg ouput need to specify for writing output`);
    }
    await fsPromise.writeFile(this.outputFile, data, 'utf8');
  }

  public async writeLine(data: string) {
    return this.write(`${data}\n`);
  }
  public async append(data: string) {
    if (this.outputFile === undefined) {
      throw new Error(`Arg ouput need to specify for writing output`);
    }
    await fsPromise.appendFile(this.outputFile, data, 'utf8');
  }

  public async appendLine(data: string) {
    return this.append(`${data}\n`);
  }

  public async writeLineCsv(array: string[]){
    return this.writeLine(stringifyArrayToCsvRow(array));
  }

  public async appendLineCsv(array: string[]){
    return this.appendLine(stringifyArrayToCsvRow(array));
  }
}
