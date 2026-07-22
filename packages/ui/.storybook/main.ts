import type { StorybookConfig } from '@storybook/react-vite'
import { join, dirname, resolve } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const here = dirname(fileURLToPath(import.meta.url))

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
  /* Shell stories are globbed above, so shell modules resolve through this config —
     including the `@` → src alias that only apps/shell/vite.config.ts declares. */
  viteFinal(config) {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(here, '../../../apps/shell/src'),
    }
    return config
  },
}

export default config
