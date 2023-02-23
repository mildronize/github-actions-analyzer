import {
  WorkflowTrigger_WorkflowDispatch,
  WorkflowTrigger_PullRequest,
  WorkflowTrigger_Push,
  WorkflowTrigger_WorkflowRun,
} from './workflow_trigger';

export type DefinedGithubActions = GithubActions | GithubWorkflows;
export type GithubActionsType = 'workflow' | 'actions' | null;

export interface GithubActionsBase<Type extends GithubActionsType> {
  /**
   * Special Field for recognize type of actions
   */
  type: Type;
}

/**
 * [Metadata syntax for GitHub Actions](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#about-yaml-syntax-for-github-actions)
 * TODO: Cover all fields
 */

export interface GithubActions extends GithubActionsBase<'actions'> {
  type: 'actions',
  /**
   * Required The name of your action. GitHub displays the name in the Actions tab to help visually identify actions in each job.
   */
  name?: string;
  /**
   * Optional The name of the action's author.
   */
  author?: string;
  /**
   * Required A short description of the action.
   */
  description?: string;

  inputs?: {
    [key in string]: GithubActionsInput;
  };

  outputs?: {
    [key in string]: GithubActionsOutput;
  };

  /**
   * Required Specifies whether this is a JavaScript action, a composite action, or a Docker container action and how the action is executed.
   */
  runs?: {
    using: string;
    main?: string;
    steps: GithubWorkflows_Job_Step[];
  }
}

interface GithubActionsInput{
  description: string;
  required?: boolean;
  default?: string;
}

interface GithubActionsOutput{
  description: string;
  value: string;
}



// ------------------------------------ GithubWorkflows ------------------------------

export interface GithubWorkflows extends GithubActionsBase<'workflow'> {
  type: 'workflow',
  /**
   * Workflow Name
   */
  name?: string;

  /**
   * `on` prop has exist when `workflow` type
   */

  on?:
    | WorkflowTrigger_WorkflowDispatch
    | WorkflowTrigger_WorkflowRun
    | WorkflowTrigger_PullRequest
    | WorkflowTrigger_Push
    | Record<string, any>;

  env?: Record<string, string>;

  /**
   * `jobs` prop has exist when `workflow` type
   */
  jobs?: {
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
