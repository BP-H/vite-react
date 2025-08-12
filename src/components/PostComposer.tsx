import { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');
  return (
    <div className="composer">
      <textarea
        placeholder="Share something cosmic…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="field field--textarea"
      />
      <div className="composer__actions">
        <div className="muted caption">Draft only (demo)</div>
        <button className="btn btn--primary" onClick={() => setText('')}>
          Post
        </button>
      </div>
    </div>
  );
}
