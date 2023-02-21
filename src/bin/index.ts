#!/usr/bin/env node
import yargs from 'yargs';
import { GithubActionsAnalyzer } from '..';

(async () => {
  const argv = await yargs(process.argv.slice(2))
    .scriptName('calc')
    .usage('Usage: $0 -f [config]')
    .command('count', 'Count the lines in a file')
    .alias('f', 'file')
    .describe('f', 'yaml path')
    .alias('h', 'help')
    .demandOption(['file']).argv;

  if(typeof argv.file !== 'string'){
    throw new Error('xxx');
  }

  console.log('The width is:', argv.file);
  await new GithubActionsAnalyzer().init(argv.file);
  //   .scriptName('line-count')
  //   .usage('Usage: $0 <command> [options]')
  //   .command('count', 'Count the lines in a file')
  //   .example('$0 count -f foo.js', 'count the lines in the given file')
  //   .alias('f', 'file')
  //   .nargs('f', 1)
  //   .describe('f', 'Load a file')
  //   .demandOption(['f'])
  //   .help('h')
  //   .alias('h', 'help')
  //   .epilog('copyright 2019').argv;

  // var fs = require('fs');
  // var s = fs.createReadStream(argv.file);

  // var lines = 0;
  // s.on('data', function (buf) {
  //   lines += buf.toString().match(/\n/g).length;
  // });

  // s.on('end', function () {
  //   console.log(lines);
  // });
})();
