import type { CommandOptions } from '../../lib/baseCommand';

import chalk from 'chalk';
// eslint-disable-next-line no-restricted-imports
import nodeFetch from 'node-fetch';

import pkg from '../../../package.json';
import Command, { CommandCategories } from '../../lib/baseCommand';
import prepareOas from '../../lib/prepareOas';

export interface Options {
  spec?: string;
  workingDirectory?: string;
}

export default class OpenAPIValidateCommand extends Command {
  constructor() {
    super();

    this.command = 'openapi:preview';
    this.usage = 'openapi:preview [file|url] [options]';
    this.description = 'Preview your OpenAPI/Swagger definition on bin.readme.com.';
    this.cmdCategory = CommandCategories.APIS;

    this.hiddenArgs = ['spec'];
    this.args = [
      {
        name: 'spec',
        type: String,
        defaultOption: true,
      },
      this.getWorkingDirArg(),
      this.getGitHubArg(),
    ];
  }

  async run(opts: CommandOptions<Options>) {
    const binBaseUrl = 'http://localhost:3675';
    await super.run(opts);

    const { spec, workingDirectory } = opts;

    if (workingDirectory) {
      process.chdir(workingDirectory);
    }

    const { preparedSpec, specPath, specType } = await prepareOas(spec, 'openapi:preview');

    const res = await nodeFetch(binBaseUrl, {
      body: JSON.stringify({ swagger: preparedSpec }),
      method: 'post',
      headers: { 'Content-Type': 'application/json', 'rdme-version': pkg.version },
    });

    const jsonRes = await res.json();

    console.log('jsonRes:', `${binBaseUrl}${jsonRes.url}`);

    return Promise.resolve(chalk.green(`${specPath} is a valid ${specType} API definition!`));
  }
}
