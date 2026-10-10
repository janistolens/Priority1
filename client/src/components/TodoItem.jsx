import { useState } from 'react';

function dueDateInputValue(dueDate) {
  return dueDate ? dueDate.slice(0, 16) : '';
}

function completeDueDate(dueDate) {
  return new Date(dueDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
}

function isPastDue(dueDate) {
  return new Date(dueDate) < new Date();
}

function dueRemaining(dueDate) {
  const due = new Date(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const days = Math.round((dueDay - today) / 86400000);

  if (days > 0) {
    return days === 1 ? '1 day' : `${days} days`;
  }

  const hours = Math.floor((due - now) / 3600000);
  if (hours >= 1) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }

  const minutes = Math.floor((due - now) / 60000);
  if (minutes < 1) return 'Less than 1 minute';
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
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

  const overdue = Boolean(todo.dueDate) && isPastDue(todo.dueDate);
  const pastDue = overdue && !todo.isComplete;
  const remaining = todo.dueDate && !overdue && !todo.isComplete ? dueRemaining(todo.dueDate) : null;

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

      {todo.isComplete ? (
        todo.dueDate && <span className="due-complete">{completeDueDate(todo.dueDate)}</span>
      ) : (
        <input
          type="datetime-local"
          className="due-date"
          aria-label="Due date"
          value={dueDateInputValue(todo.dueDate)}
          onChange={(e) => onDueDate(todo, e.target.value || null)}
        />
      )}
      {pastDue && <span className="past-due-flag">Past due</span>}
      {remaining && (
        <span className="due-remaining">{remaining}</span>
      )}

      {!editing && (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
      <button onClick={() => onDelete(todo)}>Delete</button>
    </li>
  );
}
