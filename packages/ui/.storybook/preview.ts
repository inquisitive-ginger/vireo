import './preview-styles.css'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview, Decorator } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }) as Decorator,
  ],
}

export default preview
