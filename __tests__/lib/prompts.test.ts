import prompts from 'prompts';
import { describe, it, expect } from 'vitest';

import * as promptHandler from '../../src/lib/prompts.js';
import promptTerminal from '../../src/lib/promptWrapper.js';

const versionlist = [
  {
    version: '1',
    is_stable: true,
  },
  {
    version: '2',
    is_stable: false,
  },
];

const specList = [
  {
    _id: 'spec1',
    title: 'spec1_title',
  },
  {
    _id: 'spec2',
    title: 'spec2_title',
  },
];

const getSpecs = () => {
  return {
    body: [
      {
        _id: 'spec3',
        title: 'spec3_title',
      },
    ],
  } as unknown as Promise<Response>;
};

describe('prompt test bed', () => {
  describe('createOasPrompt()', () => {
    it('should return a create option if selected', async () => {
      prompts.inject(['create']);

      const answer = await promptTerminal(
        promptHandler.createOasPrompt(
          [
            {
              _id: '1234',
              title: 'buster',
            },
          ],
          {},
          1,
          null,
        ),
      );

      expect(answer).toStrictEqual({ option: 'create' });
    });

    it('should return specId if user chooses to update file', async () => {
      prompts.inject(['update', 'spec1']);

      const parsedDocs = {
        next: {
          page: 2,
          url: '',
        },
        prev: {
          page: 1,
          url: '',
        },
      };

      const answer = await promptTerminal(promptHandler.createOasPrompt(specList, parsedDocs, 1, getSpecs));

      expect(answer).toStrictEqual({ option: 'spec1' });
    });
  });

  describe('versionPrompt()', () => {
    it('should allow user to choose a fork if flag is not passed (creating version)', async () => {
      prompts.inject(['1', true, true]);

      const answer = await promptTerminal(promptHandler.versionPrompt(versionlist));
      expect(answer).toStrictEqual({ from: '1', is_stable: true, is_beta: true });
    });

    it('should skip fork prompt if value passed (updating version)', async () => {
      prompts.inject(['1.2.1', false, true, true, false]);

      const answer = await promptTerminal(promptHandler.versionPrompt(versionlist, { is_stable: false }));
      expect(answer).toStrictEqual({
        newVersion: '1.2.1',
        is_stable: false,
        is_beta: true,
        is_hidden: true,
        is_deprecated: false,
      });
    });
  });
});
