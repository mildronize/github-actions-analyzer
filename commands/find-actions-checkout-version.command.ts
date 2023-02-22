import { CommandRunner } from '../src/command-runner';

export default class FindActionsCheckoutVersionCommand extends CommandRunner {
  public override name: string = 'Find actions checkout version';

  public override execute() {
    console.log(`Executing... FindActionsCheckoutVersionCommand`);
    this.analyzer.printAllGithubActions();
  }
}
