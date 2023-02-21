export type WorkflowTrigger_PullRequest = {
  pull_request: {
    types?: string[];
    branches?: string[];
  } & Record<string, any>;
};
