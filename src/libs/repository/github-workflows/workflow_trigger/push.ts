export type WorkflowTrigger_Push = {
  push: {
    types?: string[];
    branches?: string[];
  } & Record<string, any>;
};
