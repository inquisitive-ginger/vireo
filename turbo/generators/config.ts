import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('plugin', {
    description: 'Scaffold a new Vireo plugin',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Plugin name (kebab-case):',
        validate: (value: string) =>
          /^[a-z][a-z0-9-]*$/.test(value) || 'Plugin name must be kebab-case (e.g. my-plugin)',
      },
      {
        type: 'input',
        name: 'port',
        message: 'Dev server port (must be unique across all plugins):',
        validate: (value: string) => /^\d{4,5}$/.test(value) || 'Port must be a 4-5 digit number',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '{{turbo.paths.root}}/plugins/{{name}}/package.json',
        templateFile: 'templates/plugin/package.json.hbs',
      },
      {
        type: 'add',
        path: '{{turbo.paths.root}}/plugins/{{name}}/vite.config.ts',
        templateFile: 'templates/plugin/vite.config.ts.hbs',
      },
      {
        type: 'add',
        path: '{{turbo.paths.root}}/plugins/{{name}}/public/manifest.json',
        templateFile: 'templates/plugin/manifest.json.hbs',
      },
      {
        type: 'add',
        path: '{{turbo.paths.root}}/plugins/{{name}}/tsconfig.json',
        templateFile: 'templates/plugin/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: '{{turbo.paths.root}}/plugins/{{name}}/src/index.ts',
        templateFile: 'templates/plugin/src/index.ts.hbs',
      },
      {
        type: 'add',
        path: '{{turbo.paths.root}}/plugins/{{name}}/src/Plugin.tsx',
        templateFile: 'templates/plugin/src/Plugin.tsx.hbs',
      },
      // Register the plugin in plugins.json so the shell Vite config picks it up
      function registerPlugin(answers: { name: string; port: string }, _config, rootPath) {
        const registryPath = resolve(rootPath as string, 'plugins.json')
        const entries = JSON.parse(readFileSync(registryPath, 'utf-8'))
        entries.push({ name: answers.name, baseUrl: `http://localhost:${answers.port}` })
        writeFileSync(registryPath, JSON.stringify(entries, null, 2) + '\n')
        return `Registered ${answers.name} in plugins.json`
      },
    ],
  })
}
