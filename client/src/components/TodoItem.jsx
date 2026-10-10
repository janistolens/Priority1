import { useState } from 'react';

function dueDateInputValue(dueDate) {
  return dueDate ? dueDate.slice(0, 16) : '';
}

function isPastDue(dueDate) {
  return new Date(dueDate) < new Date();
}

export default function TodoItem({ todo, onToggle, onRename, onDueDate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      onRename(todo, trimmed);
    } else {
      setDraft(todo.title);
    }
    setEditing(false);
  }

  const pastDue = Boolean(todo.dueDate) && !todo.isComplete && isPastDue(todo.dueDate);

  return (
    <li className={`todo-item ${pastDue ? 'past-due' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => onToggle(todo)}
        title="Mark complete / incomplete"
      />

      {editing ? (
        <input
          className="edit-title"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') {
              setDraft(todo.title);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span
          className={`title ${todo.isComplete ? 'complete' : ''}`}
          onDoubleClick={() => setEditing(true)}
          title="Double-click to edit"
        >
          {todo.title}
        </span>
      )}

      <input
        type="datetime-local"
        className={`due-date ${todo.isComplete ? 'complete' : ''}`}
        aria-label="Due date"
        value={dueDateInputValue(todo.dueDate)}
        onChange={(e) => onDueDate(todo, e.target.value || null)}
      />
      {pastDue && <span className="past-due-flag">Past due</span>}

      {!editing && (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
      <button onClick={() => onDelete(todo)}>Delete</button>
    </li>
  );
}
