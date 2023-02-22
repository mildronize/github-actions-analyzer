import fsPromise from 'node:fs/promises';
import { GithubActionsAnalyzer } from './github-actions-analyzer';
export interface CommandRunnerConfig {
  /**
   * Yaml File Config, using Format `IConfig`
   */
  file: string;

  output?: string;
}

export abstract class CommandRunner {
  public name?: string;

  private config!: CommandRunnerConfig;

  protected analyzer!: GithubActionsAnalyzer;

  public init(config: CommandRunnerConfig, analyzer: GithubActionsAnalyzer){
    this.config = config;
    this.analyzer = analyzer;
  }

  public abstract execute(): any;

  public async writeOutput(data: string){
    if(this.config.output === undefined){
      throw new Error(`Arg ouput need to specify for writing output`);
    }
    await fsPromise.writeFile(this.config.output, data, 'utf8');
  }
}
