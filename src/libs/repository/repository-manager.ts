import { NotImplementedException } from '../exceptions/not-implemented-exception';
import { GithubRepositoryData, RepositoryValidator } from './repository-validator';
import glob from 'tiny-glob';
import path from 'node:path';
import fsPromise from 'node:fs/promises';
import yaml from 'yaml';

interface IRepositoryManagerOption {
  /**
   * Current Working Directory
   */
  cwd?: string;
}

export class RepositoryManager {
  public readonly workingDirectory = '.repositories';
  public readonly githubWorkflowsPath = '.github/workflows';

  constructor(protected repositories: GithubRepositoryData[], protected option?: IRepositoryManagerOption) {}

  public validate() {
    this.repositories = RepositoryValidator.validateArray(this.repositories);
    return this.repositories;
  }

  private async processActionFiles(actionsFiles: string[]) {
    const results: NonNullable<GithubRepositoryData['actionsFiles']> = [];
    const workers = [];
    for (const file of actionsFiles) {
      workers.push(fsPromise.readFile(file, 'utf8'));
    }
    const rawDataList = await Promise.all(workers);
    for (const [index, rawData] of rawDataList.entries()) {
      results.push({
        data: yaml.parse(rawData),
        path: actionsFiles[index],
      });
    }
    return results;
  }

  public async processData() {
    for (const repo of this.repositories) {
      const actionsFiles = await this.findGithubActionsFiles(repo);
      repo.actionsFiles = await this.processActionFiles(actionsFiles || []);
    }
  }

  /**
   * Workflow Format
   *
   * "/name.yml"
   * "/name.yaml"
   * "/name/action.yml"
   * "/name/action.yaml"
   *
   * @internal
   */

  public generateGlobPatternActionsPath = (repository: GithubRepositoryData, actionsPath: string) => {
    const repoWithRef = repository.ref
      ? [repository.repo, repository.ref.replaceAll('/', '__')].join('@')
      : repository.repo;
    return [
      path.join(this.workingDirectory, repository.org, repoWithRef, actionsPath, '*.yml'),
      path.join(this.workingDirectory, repository.org, repoWithRef, actionsPath, '*.yaml'),
      // prettier-ignore
      path.join(this.workingDirectory, repository.org, repoWithRef,actionsPath, '**/action.yml'),
      // prettier-ignore
      path.join(this.workingDirectory, repository.org, repoWithRef,actionsPath, '**/action.yaml'),
    ];
  };

  public async findGithubActionsFiles(repository: GithubRepositoryData) {
    try {
      const cwd = this.option?.cwd ?? '.';
      const repositoryGlobPatterns: string[] = [];
      for (const actionsPath of repository.actionsPaths || []) {
        repositoryGlobPatterns.push(...this.generateGlobPatternActionsPath(repository, actionsPath));
      }
      const globPatterns = [
        ...this.generateGlobPatternActionsPath(repository, this.githubWorkflowsPath),
        ...repositoryGlobPatterns,
      ];

      const globWorker = [];
      for (const globPattern of globPatterns) {
        globWorker.push(glob(globPattern, { cwd }));
      }

      const githubActionsFiles = await Promise.all(globWorker);
      const flatten = [];
      for (const file of githubActionsFiles) {
        flatten.push(...file);
      }
      return flatten;
    } catch (e: unknown) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  public getRepositories() {
    return this.repositories;
  }

  public checkoutMany() {
    /**
     *  ## Assume we've lib to download repo from github
        - This can help to use github actions locally, https://stackoverflow.com/questions/63722151/set-github-actions-input-value-for-local-testing
        - https://github.com/actions/checkout

        ### Format to download
        - `.repositories`
          - `org`
            - `repo name`
     */
    throw new NotImplementedException();
  }
}
