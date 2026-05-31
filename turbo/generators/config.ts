import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('plugin', {
    description: 'Scaffold a new Family OS plugin',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Plugin name (kebab-case):',
        validate: (value: string) =>
          /^[a-z][a-z0-9-]*$/.test(value) || 'Plugin name must be kebab-case (e.g. my-plugin)',
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
        path: '{{turbo.paths.root}}/plugins/{{name}}/manifest.json',
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
    ],
  })
}
