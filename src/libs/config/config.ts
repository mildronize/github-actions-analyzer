import { GithubRepository, GithubRepositoryData, RepositoryValidator } from '../repository';
import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import yaml from 'yaml';
import { PartialRequired } from '../types';
import { setDefaultValue } from '../utils';
import path from 'node:path';

interface IConfig {
  repositories: GithubRepositoryData[];
}

interface IConfigOption {
  /**
   * Current Working Directory
   */
  cwd?: string;
}

export class Config {
  config!: IConfig;

  constructor(protected option?: IConfigOption) {}

  async load(file: string) {
    const actualPath = this.option?.cwd ? path.join(this.option.cwd, file) : file;
    const configFile = await fsPromise.readFile(actualPath, 'utf8');
    // TODO: assume schema is correct, using zod later
    this.config = yaml.parse(configFile) as IConfig;
  }

  public getConfig() {
    return this.config;
  }
}
