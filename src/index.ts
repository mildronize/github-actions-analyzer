import path from 'node:path';
import { CommandRunner } from './command-runner';
import PrettyError from 'pretty-error';
import { GithubActionsAnalyzer } from './github-actions-analyzer';

interface BootstrapConfig {
  configFile: string;
  output?: string;
  commandFile: string;
}

export async function bootstrap(config: BootstrapConfig) {
  try {
    // TODO: To fix path resolving later
    const Command = await import(path.join('..', config.commandFile));
    const instance: CommandRunner = new Command.default();
    const analyzer = new GithubActionsAnalyzer()
    await analyzer.init(config.configFile);
    instance.init({
      file: config.configFile,
      output: config.output,
    }, analyzer);
    const commandName = instance.name ?? Command.default.name;
    console.log(`Running command... '${commandName}'`)
    await instance.execute();
  } catch (error) {
    if (error instanceof Error) console.log(new PrettyError().render(error));
  }
}
