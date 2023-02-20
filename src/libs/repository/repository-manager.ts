import { setDefaultValue } from '../utils';
import type { PartialRequired } from '../types';
import '../exceptions/not-implemented-exception';
import { NotImplementedException } from '../exceptions/not-implemented-exception';

interface IRepositoryManagerConfig {
  /**
   * Current Working Directory
   */
  cwd?: string;
}

type DefaultConfigProp = 'cwd';

export class RepositoryManager {
  config: PartialRequired<IRepositoryManagerConfig, DefaultConfigProp>;
  public readonly workingDirectory = '.repositories';

  constructor(_config: IRepositoryManagerConfig) {
    this.config = setDefaultValue(_config, {
      cwd: process.cwd(),
    }) as PartialRequired<IRepositoryManagerConfig, DefaultConfigProp>;
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

const test = new RepositoryManager({});
