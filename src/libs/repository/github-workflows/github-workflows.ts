import {
  WorkflowTrigger_WorkflowDispatch,
  WorkflowTrigger_PullRequest,
  WorkflowTrigger_Push,
  WorkflowTrigger_WorkflowRun,
} from './workflow_trigger';

/**
 * Workflow Format
 *
 * "/name.yml"
 * "/name.yaml"
 * "/name/action.yml"
 * "/name/action.yaml"
 */

export interface GithubWorkflows {
  /**
   * Workflow Name
   */
  name?: string;

  on:
    | WorkflowTrigger_WorkflowDispatch
    | WorkflowTrigger_WorkflowRun
    | WorkflowTrigger_PullRequest
    | WorkflowTrigger_Push
    | Record<string, any>;

  env?: Record<string, string>;

  jobs: {
    [key in string]: GithubWorkflows_Job;
  };
}

type GithubWorkflows_Job = {
  'runs-on': string;
  outputs?: Record<string, any>;
  needs?: string | string[];
  'timeout-minutes'?: number;
  strategy?: {
    matrix: Record<string, any>;
  } & Record<string, any>;
  steps: GithubWorkflows_Job_Step[];
} & Record<string, any>;

type GithubWorkflows_Job_Step = {
  name?: string;
  uses?: string;
  with?: Record<string, string>;
  id?: string;
  'working-directory'?: string;
  run?: string;
  env?: Record<string, string>;
  if?: string;
  shell?: string;
};
