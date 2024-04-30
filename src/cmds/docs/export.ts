import type { AuthenticatedCommandOptions } from '../../lib/baseCommand.js';

import Command, { CommandCategories } from '../../lib/baseCommand.js';

export interface Options {
  confirm?: boolean;
  dryRun?: boolean;
  folder?: string;
}

export default class DocsExportCommand extends Command {
  constructor() {
    super();

    this.command = 'docs:export';
    this.usage = 'docs:export <folder> [options]';
    this.description = 'Creates a ZIP containing an export of your Markdown guides for the specified version.';
    this.cmdCategory = CommandCategories.DOCS;

    this.hiddenArgs = ['folder'];
    this.args = [
      this.getKeyArg(),
      this.getVersionArg(),
      {
        name: 'out',
        type: String,
        description: 'Output file path to write reduced file to',
      },
      // this.getGitHubArg(),
    ];
  }

  async run(opts: AuthenticatedCommandOptions<Options>) {
    await super.run(opts);

    // const { dryRun, folder, key, version } = opts;

    console.log('opts:', opts);

    return Promise.resolve('success!');
  }
}
