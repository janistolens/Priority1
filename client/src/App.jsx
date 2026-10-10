import { useEffect, useState } from 'react';
import {
  getTodoLists,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api';
import AddTodoForm from './components/AddTodoForm';
import ListPanel from './components/ListPanel';
import TodoList from './components/TodoList';

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTodoLists()
      .then((loaded) => {
        setLists(loaded);
        setSelectedListId(loaded.length > 0 ? loaded[0].id : null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingLists(false));
  }, []);

  useEffect(() => {
    if (selectedListId == null) {
      setTodos([]);
      return;
    }

    let cancelled = false;
    setLoadingTodos(true);
    getTodos(selectedListId)
      .then((loaded) => {
        if (!cancelled) setTodos(loaded);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingTodos(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedListId]);

  const selectedList = lists.find((list) => list.id === selectedListId) ?? null;

  function selectList(id) {
    setSelectedListId(id);
    setTodos([]);
    setLoadingTodos(id != null);
  }

  async function handleCreateList(title) {
    try {
      const created = await createTodoList({ title });
      setLists((prev) => [...prev, created]);
      selectList(created.id);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRenameList(list, title) {
    try {
      const updated = await updateTodoList(list.id, { title });
      setLists((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDeleteList(list) {
    try {
      await deleteTodoList(list.id);
      const remaining = lists.filter((item) => item.id !== list.id);
      setLists((prev) => prev.filter((item) => item.id !== list.id));
      if (selectedListId === list.id) {
        selectList(remaining[0]?.id ?? null);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleAdd(title) {
    if (selectedListId == null) return;
    try {
      const created = await createTodo({ title, listId: selectedListId });
      setTodos((prev) => [...prev, created]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        isComplete: !todo.isComplete,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRename(todo, title) {
    try {
      const updated = await updateTodo(todo.id, {
        title,
        isComplete: todo.isComplete,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(todo) {
    try {
      await deleteTodo(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="app">
      <h1>Priority1 ToDo</h1>

      {error && <div className="error">{error}</div>}

      {loadingLists ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="workspace">
          <ListPanel
            lists={lists}
            selectedListId={selectedListId}
            onSelect={selectList}
            onCreate={handleCreateList}
            onRename={handleRenameList}
            onDelete={handleDeleteList}
          />

          <section className="items-panel">
            {selectedList ? (
              <>
                <h2>{selectedList.title}</h2>
                <AddTodoForm onAdd={handleAdd} />
                {loadingTodos ? (
                  <p className="muted">Loading…</p>
                ) : (
                  <TodoList
                    todos={todos}
                    onToggle={handleToggle}
                    onRename={handleRename}
                    onDelete={handleDelete}
                  />
                )}
              </>
            ) : (
              <p className="muted">Select or create a list to see its todos.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
