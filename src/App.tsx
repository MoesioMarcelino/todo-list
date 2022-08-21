import { Fragment, useState, ChangeEvent, FormEvent, useEffect } from 'react'

import logoImg from './assets/logo.svg'
import plusImg from './assets/plus.svg'
import emptyImg from './assets/empty.svg'
import trashImg from './assets/trash.svg'

import './global.css'
import styles from './app.module.css'

type Task = {
  id: number
  title: string
  done: boolean
}

const STORAGE_KEY = '@todo-list'

export function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storage = localStorage.getItem(STORAGE_KEY)

    if (storage) {
      return JSON.parse(storage)
    }

    return []
  })

  const tasksDone = tasks.reduce((acc, { done }) => acc + Number(done), 0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function handleChangeInput(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    setNewTask(event.target.value)
  }

  function createNewTask(event: FormEvent) {
    event.preventDefault()
    setTasks((oldTasks) => [...oldTasks, { title: newTask, done: false, id: tasks.length + 1 }])
    setNewTask('')
  }

  function handleChangeTask(id: number) {
    setTasks((oldTasks) =>
      oldTasks.map((task) => ({ ...task, done: task.id === id ? !task.done : task.done }))
    )
  }

  function handleDeleteTask(id: number) {
    setTasks((oldTasks) => oldTasks.filter((task) => task.id !== id))
  }

  return (
    <Fragment>
      <div className={styles.backgroundAdditional} />

      <main>
        <header>
          <img src={logoImg} alt="Logo Todo List" />
          <form className={styles.createContainer} onSubmit={createNewTask}>
            <input
              placeholder="Adicione uma nova tarefa"
              value={newTask}
              onChange={handleChangeInput}
            />
            <button type="submit">
              Criar
              <img src={plusImg} alt="Criar uma nova tarefa" />
            </button>
          </form>
        </header>

        <section>
          <header>
            <div className={styles.tasksCreated}>
              Tarefas criadas
              <div className={styles.counter}>{tasks.length}</div>
            </div>
            <div className={styles.tasksConcluded}>
              Concluídas
              <div className={styles.counter}>
                {tasksDone} de {tasks.length}
              </div>
            </div>
          </header>

          <div className={styles.tasksContainer}>
            {tasks.length > 0 ? (
              <div className={styles.taskList}>
                {tasks.map(({ id, title, done }) => (
                  <div className={styles.task} key={`${title}-${id}`}>
                    <div className={done ? styles.done : ''}>
                      <input
                        type="checkbox"
                        id="input"
                        checked={done}
                        onChange={() => handleChangeTask(id)}
                      />
                      <label htmlFor="input">{title}</label>
                    </div>
                    <button type="button" onClick={() => handleDeleteTask(id)}>
                      <img src={trashImg} alt="Apagar uma tarefa" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <Fragment>
                <div className={styles.divider} />
                <div className={styles.empty}>
                  <img src={emptyImg} alt="Lista de tarefas vazia" />
                  <strong>Você ainda não tem tarefas cadastradas</strong>
                  <span>Crie tarefas e organize seus itens a fazer</span>
                </div>
              </Fragment>
            )}
          </div>
        </section>
      </main>
    </Fragment>
  )
}
