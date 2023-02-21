import '../exceptions/not-implemented-exception';
import { NotImplementedException } from '../exceptions/not-implemented-exception';
import { GithubRepository } from './repository.schema';
import { RepositoryValidator } from './repository-validator';

export class RepositoryManager {

  public readonly workingDirectory = '.repositories';

  constructor(protected repositories: GithubRepository[]) {}

  public validate(){
    return RepositoryValidator.validateArray(this.repositories);
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
