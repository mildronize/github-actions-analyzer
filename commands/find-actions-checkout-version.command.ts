import path from 'node:path';
import chalk from 'chalk';
import { CommandRunner } from '../src/command-runner';

export default class FindActionsCheckoutVersionCommand extends CommandRunner {
  public override name: string = 'Find actions checkout version';

  public override execute() {
    console.log(`Executing... FindActionsCheckoutVersionCommand`);
    this.analyzer.printAllGithubActions();
    for (const repo of this.analyzer.repositories) {
      // console.log(repo.actionsFiles);
      for (const actionsFile of repo.actionsFiles || []) {
        const repoRef = repo.ref ? [repo.repository, repo.ref].join('@') : repo.repository;
        const actionName = actionsFile.data.name ?? path.basename(actionsFile.path);
        if (!actionsFile.data.jobs) {
          console.error(chalk.red(`${repoRef}: ${actionName}! No job found!`));
        }
        for (const [jobId, job] of Object.entries(actionsFile.data.jobs || {})) {
          console.log(`${repoRef}: ${actionName} [${jobId}]`);
        }
      }
    }
  }
}
