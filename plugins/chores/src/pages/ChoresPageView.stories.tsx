import type { Meta, StoryObj } from '@storybook/react'
import { Plus } from 'lucide-react'
import { Button } from '@family-os/ui'
import { ChoresPageView } from './ChoresPageView'
import { SAMPLE_TASKEE_TASKS, SAMPLE_FAMILY_TASKS } from '../sample-tasks'
import { StoryAnnotation } from '../story-annotation'

const meta: Meta<typeof ChoresPageView> = {
  title: 'Chores/Chores Page',
  component: ChoresPageView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, ctx) => (
      <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <div style={{ padding: '16px 24px 0' }}>
          <StoryAnnotation>{ctx.parameters.annotation}</StoryAnnotation>
        </div>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChoresPageView>

const newTaskButton = (
  <Button>
    <Plus size={16} />
    New Task
  </Button>
)

// Empty-state CTA — sm per the empty-state convention (EmptyState stories + family-feed).
const emptyNewTaskButton = (
  <Button size="sm">
    <Plus size={16} />
    New Task
  </Button>
)

const resolve = () => Promise.resolve()

export const Taskee: Story = {
  name: 'Taskee — own list',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 1,
    seesAllTasks: false,
    canManage: false,
  },
  parameters: {
    annotation:
      'tiers 1–3 · own tasks only · STATUS-encoded cards · tap a completion circle for the XP flight — the badge arcs to the lifetime score plate, which banks + counts up (design §2; runs locally here, no network)',
  },
}

export const Admin: Story = {
  name: 'Admin — grouped by assignee',
  args: {
    tasks: SAMPLE_FAMILY_TASKS,
    tier: 4,
    seesAllTasks: true,
    canManage: true,
    newTaskButton,
    onAddForAssignee: () => {},
    onCompleteTask: resolve,
    onReopenTask: resolve,
    onEditTask: () => {},
    onRemoveTask: () => {},
  },
  parameters: {
    annotation:
      'tier 4 · all family tasks · per-assignee lanes · tap a row to edit (drawer prefills) — pencil affordance on sm+, hidden on mobile · inline Remove (confirm) at every width, 44px targets · tap a circle to check off ANY task (Option A, plain check-off — no flight) · a completed row’s check un-completes it (reopen)',
  },
}

export const FamilyDashboard: Story = {
  name: 'Family dashboard — read-only board',
  args: {
    tasks: SAMPLE_FAMILY_TASKS,
    tier: 1,
    seesAllTasks: true,
    canManage: false,
  },
  parameters: {
    annotation:
      'family pseudo-profile · sees all family tasks (family framing) but cannot create — by-assignee board with no add affordances',
  },
}

export const TaskeeEmpty: Story = {
  name: 'Taskee — empty (tier 1, warm)',
  args: {
    tasks: [],
    tier: 1,
    seesAllTasks: false,
    canManage: false,
  },
  parameters: { annotation: 'taskee · tier 1 warm tone · no CTA (cannot create)' },
}

export const AdminEmpty: Story = {
  name: 'Admin — empty',
  args: {
    tasks: [],
    tier: 4,
    seesAllTasks: true,
    canManage: true,
    emptyAction: emptyNewTaskButton,
  },
  parameters: { annotation: 'admin · no tasks yet — empty-state CTA prompts the first assignment' },
}
