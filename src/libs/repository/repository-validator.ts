import { GithubWorkflows } from './github-workflows/github-workflows';
import { GithubRepository, githubRepositorySchema } from './repository.schema';

export interface GithubRepositoryData extends GithubRepository {
  org: string;
  repo: string;

  actionsFiles?: {
    path: string;
    data: GithubWorkflows;
  }[];
}

export class RepositoryValidator {
  public static validateArray(repositoryList: Partial<GithubRepositoryData>[]): GithubRepositoryData[] {
    for (let repository of repositoryList) {
      repository = RepositoryValidator.validate(repository);
    }
    return repositoryList as GithubRepositoryData[];
  }

  public static validate(repository: Partial<GithubRepositoryData>): GithubRepositoryData {
    const result = githubRepositorySchema.safeParse(repository);
    if (!result.success) {
      const formatted = result.error.format();
      // TODO: Make Human readable error message
      console.error(JSON.stringify(formatted, null, 2));
      throw new Error(`Input Validation Error at ${repository.repository}`);
    }
    const split = repository.repository?.split('/');
    if(split?.length !== 2) throw Error(`repository '${repository.repository}' pattern should be 'org/repository_name'`);
    repository.org = split[0];
    repository.repo = split[1];
    if (!repository.actionsPaths) repository.actionsPaths = [];
    return repository as GithubRepositoryData;
  }
}
