#!/usr/bin/env node
import yargs from 'yargs';
import { bootstrap } from '../main';

(async () => {
  const argv = await yargs(process.argv.slice(2))
    .scriptName('calc')
    .usage('Usage: $0 -f [config] -o [output]')
    // .command('count', 'Count the lines in a file')
    .alias('f', 'file')
    .describe('f', 'yaml path')
    .alias('c', 'command')
    .describe('c', 'TypeScript Command File')
    .alias('o', 'output')
    .describe('o', 'output path')
    .alias('h', 'help')
    .demandOption(['file', 'command']).argv;

  await bootstrap({
    configFile: (argv.file as string).toString(),
    output: argv.output === undefined ? undefined : (argv.output as string),
    commandFile: (argv.command as string).toString(),
  });

  // await new GithubActionsAnalyzer().init(argv.file);
})();
