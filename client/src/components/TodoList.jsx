import TodoItem from './TodoItem';

function TodoItems({ todos, onToggle, onRename, onDueDate, onDelete }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onDueDate={onDueDate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default function TodoList({ todos, onToggle, onRename, onDueDate, onDelete }) {
  if (todos.length === 0) {
    return <p className="muted">No todos yet. Add one above.</p>;
  }

  const open = todos.filter((todo) => !todo.isComplete);
  const complete = todos.filter((todo) => todo.isComplete);
  const itemProps = { onToggle, onRename, onDueDate, onDelete };

  return (
    <>
      {open.length > 0 && <TodoItems todos={open} {...itemProps} />}
      {complete.length > 0 && (
        <section className="complete-list">
          <h3>Done</h3>
          <TodoItems todos={complete} {...itemProps} />
        </section>
      )}
    </>
  );
}
