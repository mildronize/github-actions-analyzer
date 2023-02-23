import path from 'node:path';
import chalk from 'chalk';
import { CommandRunner, GithubRepositoryData, GithubWorkflows_Job_Step } from '../src';

type ActionFile = NonNullable<GithubRepositoryData['actionsFiles']>[number];

const actionCheckoutRepository = 'actions/checkout';
const getRepoWithRef = (repo: GithubRepositoryData) =>
  repo.ref ? [repo.repository, repo.ref].join('@') : repo.repository;
const getActionName = (actionsFile: ActionFile) => actionsFile.data.name ?? path.basename(actionsFile.path);
const getStepName = (step: GithubWorkflows_Job_Step): string => {
  if (step.name) return step.name;
  if (step.uses) return step.uses;
  if (step.run) return step.run;
  return 'No step name!';
};

const isStepUsesRepo = (step: GithubWorkflows_Job_Step, repo: string) => {
  if (!step.uses) return false;
  const foundActionsCheckout = step.uses.indexOf(repo);
  if (foundActionsCheckout < 0) return false;
  return true;
};
const getActionsCheckoutVersion = (step: GithubWorkflows_Job_Step): string | undefined => {
  if (!step.uses) return undefined;
  if (!isStepUsesRepo(step, actionCheckoutRepository)) return undefined;
  const split = step.uses.split('@');
  if (split.length < 2) return undefined;
  return split[1];
};

const tableHeaders = ['Org', 'Repo', 'Ref', 'Name', 'Type', 'Job Id', 'Step Name','Actions', 'version'];
const generateCommonRow = (repo: GithubRepositoryData, actionsFile: ActionFile) => [
  repo.org,
  repo.repo,
  repo.ref || '',
  getActionName(actionsFile),
  actionsFile.data.type,
];

export default class FindActionsCheckoutVersionCommand extends CommandRunner {
  public override name: string = 'Find actions checkout version';

  public override async execute() {
    this.file.writeLineCsv(tableHeaders);
    for (const repo of this.analyzer.repositories) {
      for (const actionsFile of repo.actionsFiles || []) {
        await this.handleWorkflow(repo, actionsFile);
        await this.handleActions(repo, actionsFile);
      }
    }
  }

  private async handleWorkflow(repo: GithubRepositoryData, actionsFile: ActionFile) {
    if (actionsFile.data.type !== 'workflow') return;
    const repoRef = getRepoWithRef(repo);
    const actionName = getActionName(actionsFile);
    if (!actionsFile.data.jobs) {
      console.error(chalk.red(`${repoRef}: ${actionName}! Incomplete workflow, no job found!`));
      return;
    }
    for (const [jobId, job] of Object.entries(actionsFile.data.jobs || {})) {
      console.log(chalk.blue(`${repoRef}: ${actionName} [${jobId}]`));
      await this.handleJobSteps(repo, actionsFile, jobId, job.steps || []);
    }
  }

  private async handleActions(repo: GithubRepositoryData, actionsFile: ActionFile) {
    if (actionsFile.data.type !== 'actions') return;
    const repoRef = getRepoWithRef(repo);
    const actionName = getActionName(actionsFile);
    if (!actionsFile.data.runs) {
      console.error(chalk.red(`${repoRef}: ${actionName}! Incomplete actions, No runs found!`));
      return;
    }
    console.log(chalk.green(`${repoRef}: ${actionName}: Actions Type`));
    await this.handleJobSteps(repo, actionsFile, '', actionsFile.data.runs.steps || []);
  }

  private async handleJobSteps(
    repo: GithubRepositoryData,
    actionsFile: ActionFile,
    jobId: string,
    steps: GithubWorkflows_Job_Step[]
  ) {
    for (const step of steps) {
      const useActionsCheckout = isStepUsesRepo(step, actionCheckoutRepository);
      if (!useActionsCheckout) continue;
      const stepLines = [jobId, getStepName(step), actionCheckoutRepository];

      const actionsCheckoutVersion = getActionsCheckoutVersion(step);
      if (actionsCheckoutVersion) stepLines.push(actionsCheckoutVersion);
      await this.file.appendLineCsv([...generateCommonRow(repo, actionsFile), ...stepLines]);
    }
  }
}
