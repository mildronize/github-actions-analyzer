import { setDefaultValue } from "../utils";
import type { PartialRequired } from "../types";


interface IRepositoryManagerConfig {
  /**
   * Current Working Directory
   */
  cwd?: string;
}

interface IGithubRepository {
  repository: string;
  /**
   * Empty use default branch
   */
  ref?: string;
  token: string;
  /**
   * GitHub Actions paths, using glob pattern
   */
  actionsPath: string[];
}

type RepositoryManagerConfig = PartialRequired<IRepositoryManagerConfig, "cwd">;

export class RepositoryManager {
  config: RepositoryManagerConfig;
  public readonly workingDirectory = ".repositories";

  constructor(_config: IRepositoryManagerConfig) {
    this.config = setDefaultValue(_config, {
      cwd: process.cwd(),
    }) as RepositoryManagerConfig;
  }

}

const test = new RepositoryManager({});
