import { FC, FormEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export const App: FC = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<{ task: string; id: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/todos");
      if (!resp.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await resp.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resp = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      });

      if (!resp.ok) {
        throw new Error("Failed to add task");
      } else {
        getTasks();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add task");
    } finally {
      setTask("");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const removeTask = async (id: string) => {
    try {
      const resp = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        throw new Error("Failed to delete task");
      } else {
        getTasks();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <header>
          <article>
            <h1>TODO</h1>
          </article>
        </header>
        <article>
          <form onSubmit={handleSubmit}>
            <label>
              Task
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                type="text"
                placeholder="Enter task name ..."
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </article>
        {isLoading ? (
          <article aria-busy="true"></article>
        ) : (
          <article>
            <h2>Tasks</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={2}>No tasks add some!</td>
                  </tr>
                )}
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.task}</td>
                    <td>
                      <button onClick={() => removeTask(task.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        )}
      </div>
    </>
  );
};
