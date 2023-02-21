import { Config } from './libs/config';
import { RepositoryManager } from './libs/repository';

export function sum(number1: number, number2: number): number {
  return number1 + number2;
}

export class GithubActionsAnalyzer {
  public async init(file: string) {
    const config = new Config();
    await config.load(file);
    const repositoryManager = new RepositoryManager(config.getConfig().repositories);
    repositoryManager.validate();
    console.log(JSON.stringify(repositoryManager.getRepositories(), null, 2));
    console.log('findGithubActionsFiles',
      await repositoryManager.findGithubActionsFiles(repositoryManager.getRepositories()[0])
    );
  }
}
