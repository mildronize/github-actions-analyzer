import path from 'node:path';
import chalk from 'chalk';
import { CommandRunner, GithubRepositoryData } from '../src';

type ActionFile = NonNullable<GithubRepositoryData['actionsFiles']>[number];

const getRepoWithRef = (repo: GithubRepositoryData) =>
  repo.ref ? [repo.repository, repo.ref].join('@') : repo.repository;
const getActionName = (actionsFile: ActionFile) => actionsFile.data.name ?? path.basename(actionsFile.path);

export default class FindActionsCheckoutVersionCommand extends CommandRunner {
  public override name: string = 'Find actions checkout version';

  public override execute() {
    for (const repo of this.analyzer.repositories) {
      for (const actionsFile of repo.actionsFiles || []) {
        this.handleWorkflow(repo, actionsFile);
        this.handleActions(repo, actionsFile);
      }
    }
  }

  private handleWorkflow(repo: GithubRepositoryData, actionsFile: ActionFile) {
    if (actionsFile.data.type !== 'workflow') return;
    const repoRef = getRepoWithRef(repo);
    const actionName = getActionName(actionsFile);
    if (!actionsFile.data.jobs)
      console.error(chalk.red(`${repoRef}: ${actionName}! Incomplete workflow, no job found!`));
    for (const [jobId, job] of Object.entries(actionsFile.data.jobs || {})) {
      console.log(chalk.blue(`${repoRef}: ${actionName} [${jobId}]`));
    }
  }

  private handleActions(repo: GithubRepositoryData, actionsFile: ActionFile) {
    if (actionsFile.data.type !== 'actions') return;
    const repoRef = getRepoWithRef(repo);
    const actionName = getActionName(actionsFile);
    if (!actionsFile.data.runs)
      console.error(chalk.red(`${repoRef}: ${actionName}! Incomplete actions, No runs found!`));
    console.log(chalk.green(`${repoRef}: ${actionName}: Actions Type`));
  }
}
