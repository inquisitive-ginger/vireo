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
    options: {
      storySort: {
        order: [
          'Foundation',
          ['Color', 'Elevation', 'Typography', 'Motion'],
          'Primitives',
          ['Form', 'Dialog', 'EmptyState'],
          'Platform',
          ['ProfileAvatar', 'ProfileListItem', 'PermissionToggle'],
          'Home Surface',
          ['WidgetGrid', 'WidgetSlot', 'PlaceholderCard'],
        ],
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
