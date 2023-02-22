import path from 'node:path';
import { Config } from './libs/config';
import { GithubRepositoryData, RepositoryManager } from './libs/repository';

export class GithubActionsAnalyzer {

  protected _repositories!: GithubRepositoryData[];

  get repositories(){
    return this._repositories;
  }

  public async init(configFile: string) {
    const config = new Config();
    await config.load(configFile);
    const repositoryManager = new RepositoryManager(config.getConfig().repositories);
    repositoryManager.validate();
    // console.log(JSON.stringify(repositoryManager.getRepositories(), null, 2));
    await repositoryManager.processData();
    this._repositories = repositoryManager.getRepositories();
  }

  public printAllGithubActions(){
    for(const repo of this._repositories){
      for(const actionFile of repo.actionsFiles || []){
        const repoRef = repo.ref ? [repo.repository, repo.ref].join('@'): repo.repository;
        const actionName = actionFile.data.name ?? path.basename(actionFile.path);
        console.log(`[${repoRef}] ${actionName}`);
      }
    }
  }
}
