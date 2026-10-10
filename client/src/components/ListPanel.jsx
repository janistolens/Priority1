import { useState } from 'react';
import { PencilIcon, TrashIcon } from './Icons';

function ListRow({ list, selected, onSelect, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(list.title);

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== list.title) {
      onRename(list, trimmed);
    } else {
      setDraft(list.title);
    }
    setEditing(false);
  }

  return (
    <li className={`list-row ${selected ? 'selected' : ''}`}>
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
              setDraft(list.title);
              setEditing(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="list-name"
          onClick={() => onSelect(list.id)}
          onDoubleClick={() => setEditing(true)}
          title="Double-click to rename"
        >
          {list.title}
        </button>
      )}

      {!editing && (
        <button
          type="button"
          className="icon-button"
          aria-label={`Edit ${list.title}`}
          title="Edit"
          onClick={() => setEditing(true)}
        >
          <PencilIcon />
        </button>
      )}
      <button
        type="button"
        className="icon-button danger"
        aria-label={`Delete ${list.title}`}
        title="Delete"
        onClick={() => {
          if (window.confirm(`Delete "${list.title}" and all of its todos?`)) {
            onDelete(list);
          }
        }}
      >
        <TrashIcon />
      </button>
    </li>
  );
}

export default function ListPanel({
  lists,
  selectedListId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}) {
  const [title, setTitle] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setTitle('');
  }

  return (
    <aside className="list-panel">
      <h2>Lists</h2>
      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New list"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="primary">
          Add
        </button>
      </form>

      {lists.length === 0 ? (
        <p className="muted">No lists yet. Add one above.</p>
      ) : (
        <ul className="list-rows">
          {lists.map((list) => (
            <ListRow
              key={list.id}
              list={list}
              selected={list.id === selectedListId}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </aside>
  );
}
