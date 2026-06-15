import { useRef, useState } from 'react'
import type { SubmitEventHandler } from 'react'

type Task = {
  id: number
  title: string
}

const TASK_STORAGE_KEY = 'task-organizer.tasks'

function isStoredTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const task = value as { id?: unknown; title?: unknown }

  return (
    typeof task.id === 'number' &&
    Number.isInteger(task.id) &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0
  )
}

function readStoredTasks(storage?: Storage): Task[] {
  try {
    const storedTasks = (storage ?? globalThis.localStorage).getItem(TASK_STORAGE_KEY)

    if (!storedTasks) {
      return []
    }

    const parsedTasks: unknown = JSON.parse(storedTasks)

    if (!Array.isArray(parsedTasks) || !parsedTasks.every(isStoredTask)) {
      return []
    }

    return parsedTasks
  } catch {
    return []
  }
}

function writeStoredTasks(tasks: Task[], storage?: Storage) {
  try {
    (storage ?? globalThis.localStorage).setItem(
      TASK_STORAGE_KEY,
      JSON.stringify(tasks),
    )
  } catch {
    // Storage may be unavailable in private browsing or restricted environments.
  }
}

function getNextTaskId(tasks: Task[]) {
  return tasks.reduce((nextId, task) => Math.max(nextId, task.id + 1), 1)
}

function TaskOrganizer() {
  const [tasks, setTasks] = useState<Task[]>(readStoredTasks)
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [addError, setAddError] = useState('')
  const [editError, setEditError] = useState('')
  const nextId = useRef(getNextTaskId(tasks))

  const addTask: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const title = newTitle.trim()
    if (!title) {
      setAddError('Enter a task title before adding it.')
      return
    }

    const updatedTasks = [...tasks, { id: nextId.current++, title }]

    setTasks(updatedTasks)
    writeStoredTasks(updatedTasks)
    setNewTitle('')
    setAddError('')
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditError('')
  }

  const saveEdit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const title = editTitle.trim()
    if (!title) {
      setEditError('Enter a task title before saving it.')
      return
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editingId ? { ...task, title } : task,
    )

    setTasks(updatedTasks)
    writeStoredTasks(updatedTasks)
    cancelEdit()
  }

  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)

    setTasks(updatedTasks)
    writeStoredTasks(updatedTasks)

    if (editingId === taskId) {
      cancelEdit()
    }
  }

  return (
    <main className="task-organizer" aria-labelledby="task-organizer-title">
      <section className="task-hero">
        <p className="eyebrow">Task organizer</p>
        <h1 id="task-organizer-title">Plan the next useful thing</h1>
        <p className="task-intro">
          Keep a short working list, tighten titles as plans change, and remove
          tasks when they are no longer needed.
        </p>
      </section>

      <section className="task-panel" aria-labelledby="new-task-title">
        <div className="panel-header">
          <h2 id="new-task-title">Add task</h2>
          <span className="task-count">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        <form className="task-form" onSubmit={addTask} noValidate>
          <div className="field">
            <label htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value)
                setAddError('')
              }}
              placeholder="Review project notes"
            />
          </div>
          <button type="submit">Add</button>
        </form>
        {addError ? (
          <p className="form-error" role="alert">
            {addError}
          </p>
        ) : null}
      </section>

      <section className="task-list-section" aria-labelledby="task-list-title">
        <div className="panel-header">
          <h2 id="task-list-title">Tasks</h2>
          <span className="task-count" aria-live="polite">
            {tasks.length} active
          </span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one to start organizing.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className="task-item" key={task.id}>
                {editingId === task.id ? (
                  <form
                    className="edit-form"
                    aria-label={`Edit ${task.title}`}
                    onSubmit={saveEdit}
                    noValidate
                  >
                    <div className="field">
                      <label htmlFor={`edit-task-${task.id}`}>
                        Edit task title
                      </label>
                      <input
                        id={`edit-task-${task.id}`}
                        value={editTitle}
                        onChange={(event) => {
                          setEditTitle(event.target.value)
                          setEditError('')
                        }}
                      />
                    </div>
                    <div className="task-actions">
                      <button type="submit">Save</button>
                      <button
                        className="secondary"
                        type="button"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                    {editError ? (
                      <p className="form-error" role="alert">
                        {editError}
                      </p>
                    ) : null}
                  </form>
                ) : (
                  <>
                    <span className="task-title">{task.title}</span>
                    <div className="task-actions">
                      <button
                        className="secondary"
                        type="button"
                        onClick={() => startEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="danger"
                        type="button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default TaskOrganizer
