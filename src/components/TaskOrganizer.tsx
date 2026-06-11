import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

type Task = {
  id: number
  title: string
}

function TaskOrganizer() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [addError, setAddError] = useState('')
  const [editError, setEditError] = useState('')
  const nextId = useRef(1)

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = newTitle.trim()
    if (!title) {
      setAddError('Enter a task title before adding it.')
      return
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: nextId.current++, title },
    ])
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

  const saveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = editTitle.trim()
    if (!title) {
      setEditError('Enter a task title before saving it.')
      return
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingId ? { ...task, title } : task,
      ),
    )
    cancelEdit()
  }

  const deleteTask = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )

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
