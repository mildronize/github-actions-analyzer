import { GithubRepositoryData } from '../repository';
import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import yaml from 'yaml';
import { PartialRequired } from '../types';
import { setDefaultValue } from '../utils';

interface IConfig {
  repositories: GithubRepositoryData;
}

interface IConfigOption {
  /**
   * Current Working Directory
   */
  cwd?: string;
}

type DefaultConfigProp = 'cwd';

export class Config {
  option: PartialRequired<IConfigOption, DefaultConfigProp>;
  constructor(_option?: IConfigOption) {
    this.option = setDefaultValue(_option || {}, {
      cwd: process.cwd(),
    }) as PartialRequired<IConfigOption, DefaultConfigProp>;
  }

  async load(path: string) {
    const configFile = await fsPromise.readFile(path, 'utf8');
    const config = yaml.parse(configFile) as IConfig;
    console.log(config);
  }

  validate() {}
}
