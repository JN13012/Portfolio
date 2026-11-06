/** Preserve simulated terminal operations without running delayed commands in a hidden Lab. */
export function createCommandTimers() {
  type Task = { callback: () => void; remaining: number; started: number; timer?: ReturnType<typeof setTimeout> }
  const tasks = new Set<Task>()
  let running = false
  const arm = (task: Task) => {
    task.started = performance.now()
    task.timer = setTimeout(() => {
      tasks.delete(task)
      task.callback()
    }, task.remaining)
  }
  return {
    schedule(callback: () => void, delay = 0) {
      const task: Task = { callback, remaining: Math.max(0, delay), started: 0 }
      tasks.add(task)
      if (running) arm(task)
    },
    resume() {
      if (running) return
      running = true
      tasks.forEach(arm)
    },
    pause() {
      if (!running) return
      running = false
      for (const task of tasks) {
        clearTimeout(task.timer)
        task.remaining = Math.max(0, task.remaining - (performance.now() - task.started))
        task.timer = undefined
      }
    },
  }
}
