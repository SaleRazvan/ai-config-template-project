import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import TaskOrganizer from './TaskOrganizer'

function setup() {
  const user = userEvent.setup()

  render(<TaskOrganizer />)

  return { user }
}

async function addTask(user: ReturnType<typeof userEvent.setup>, title: string) {
  await user.type(screen.getByLabelText('Task title'), title)
  await user.click(screen.getByRole('button', { name: 'Add' }))
}

describe('TaskOrganizer', () => {
  it('adds a task from a trimmed title', async () => {
    const { user } = setup()

    await addTask(user, '  Review project notes  ')

    expect(screen.getByText('Review project notes')).toBeInTheDocument()
    expect(screen.getByLabelText('Task title')).toHaveValue('')
  })

  it('edits an existing task without duplicating it', async () => {
    const { user } = setup()

    await addTask(user, 'Draft release notes')
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByLabelText('Edit task title'))
    await user.type(screen.getByLabelText('Edit task title'), 'Publish release notes')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Publish release notes')).toBeInTheDocument()
    expect(screen.queryByText('Draft release notes')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('deletes a task', async () => {
    const { user } = setup()

    await addTask(user, 'Remove stale draft')
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(screen.queryByText('Remove stale draft')).not.toBeInTheDocument()
    expect(
      screen.getByText('No tasks yet. Add one to start organizing.'),
    ).toBeInTheDocument()
  })

  it('rejects empty add and save submissions', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText('Task title'), '   ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a task title before adding it.',
    )
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Task title'))
    await addTask(user, 'Keep original task')
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const editForm = screen.getByRole('form', { name: 'Edit Keep original task' })

    await user.clear(within(editForm).getByLabelText('Edit task title'))
    await user.type(within(editForm).getByLabelText('Edit task title'), '   ')
    await user.click(within(editForm).getByRole('button', { name: 'Save' }))

    expect(within(editForm).getByRole('alert')).toHaveTextContent(
      'Enter a task title before saving it.',
    )
    await user.click(within(editForm).getByRole('button', { name: 'Cancel' }))

    expect(screen.getByText('Keep original task')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
