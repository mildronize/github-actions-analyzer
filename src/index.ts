import path from 'node:path';
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
    await repositoryManager.processData();
    for(const repo of repositoryManager.getRepositories()){
      for(const actionFile of repo.actionsFiles || []){
        const repoRef = repo.ref ? [repo.repository, repo.ref].join('@'): repo.repository;
        const actionName = actionFile.data.name ?? path.basename(actionFile.path);
        console.log(`[${repoRef}] ${actionName}`);
      }
    }
  }
}
