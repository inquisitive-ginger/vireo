import type { Meta, StoryObj } from '@storybook/react'
import { Plus } from 'lucide-react'
import { Button } from '@family-os/ui'
import { ChoresPageView } from './ChoresPageView'
import {
  SAMPLE_TASKEE_TASKS,
  SAMPLE_FAMILY_TASKS,
  SAMPLE_FAMILY_TASKS_WITH_PHOTOS,
} from '../sample-tasks'
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

export const TaskeeFocus: Story = {
  name: 'Taskee — Focus view',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 1,
    seesAllTasks: false,
    canManage: false,
    focusMode: true,
  },
  parameters: {
    annotation:
      'tiers 1–2 default (or a parent override) · Focus variant · one hero "Next up" card with a big green Mark done — tap it for the XP flight; "Coming up" / "Done" collapse below; promotes the next task on landing (design §1 Spotlight; runs locally here)',
  },
}

const adminArgs = {
  tier: 4,
  seesAllTasks: true,
  canManage: true,
  newTaskButton,
  onAddForAssignee: () => {},
  onCompleteTask: resolve,
  onReopenTask: resolve,
  onEditTask: () => {},
  onRemoveTask: () => {},
}

export const Admin: Story = {
  name: 'Admin — grouped by assignee',
  args: { ...adminArgs, tasks: SAMPLE_FAMILY_TASKS },
  parameters: {
    annotation:
      'tier 4 · IDENTITY TAKES THE EDGE, STATUS TAKES THE FIELD (ADR 043): every row’s spine is its assignee’s hue in every state, so a row says whose it is on its own; status is the row’s surface — overdue wash + badge + red due text, dim + strikethrough + green check when done · quiet member header (face, name, urgency badge, XP-load meter) — no tint wash · tap a row to edit (pencil on sm+) · inline Remove (confirm) at every width, 44px targets · tap a circle to check off ANY task (Option A, no flight); a completed row’s check reopens it · toggle Hide completed above the board',
  },
}

export const AdminWithPhotos: Story = {
  name: 'Admin — with profile photos',
  args: { ...adminArgs, tasks: SAMPLE_FAMILY_TASKS_WITH_PHOTOS },
  parameters: {
    annotation:
      'THE TEST THAT MATTERS (ADR 042). Each fixture portrait is deliberately shot against ANOTHER member’s hue — a photo’s dominant colour is never its owner’s. The board must read exactly as it does without photos, because the face was never carrying the identity: the spine is. Compare against “Admin — grouped by assignee”; nothing but the circles should change.',
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
