export type WorkflowTrigger_WorkflowDispatch = {
  workflow_dispatch: {
    input?: {
      [key in string]: WorkflowDispatch_Input;
    };
  };
};


interface WorkflowDispatch_Input {
  description?: string;
  default?: string;
  /**
   * Default is false
   */
  required?: boolean;

  /**
   * Ref: https://github.blog/changelog/2021-11-10-github-actions-input-types-for-manual-workflows/
   */
  type?: 'string' | 'choice' | 'boolean' | 'environment';
}
