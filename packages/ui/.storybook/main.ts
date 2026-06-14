import type { StorybookConfig } from '@storybook/react-vite'
import { join, dirname } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    '../../../apps/shell/src/**/*.stories.@(ts|tsx)',
    '../../../plugins/*/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [getAbsolutePath('@storybook/addon-themes')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite') as '@storybook/react-vite',
    options: {},
  },
}

export default config
