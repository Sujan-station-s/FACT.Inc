import React from 'react';

const MoaClauseDisplay = ({ content, editable, onChange, className, placeholder }) => {
  const items = content ? content.split(/\n(?=(?:[ivx]+\.)\s)/gi).map(s => s.trim()) : [];

  const handleInput = (e) => {
    if (editable && onChange) {
      const listElement = e.currentTarget.querySelector('.moa-clause-list');
      let newText = "";

      if (listElement) {
        const listItems = listElement.querySelectorAll('li');
        listItems.forEach((li, index) => {
          const markerSpan = li.querySelector('.moa-clause-marker');
          const textSpan = li.querySelector('.moa-clause-text');

          if (markerSpan && textSpan) {
            const marker = markerSpan.textContent || "";
            const text = textSpan.textContent || "";
            if (marker.trim() || text.trim()) {
                newText += (index > 0 && newText.length > 0 ? "\n" : "") + marker.trim() + (marker.trim() && text.trim() ? " " : "") + text.trim();
            }
          } else if (textSpan) { 
            const text = textSpan.textContent || "";
            if (text.trim()) {
                 newText += (index > 0 && newText.length > 0 ? "\n" : "") + text.trim();
            }
          }
        });
      } else {
        newText = e.currentTarget.textContent;
      }
      onChange(newText);
    }
  };
  const handlePaste = (e) => {
    if (editable) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    }
  };

  const isEmpty = !content || content.trim() === '';

  return (
    <div
      className={`moa-clause-render-area ${className || ''} ${editable ? 'editable' : ''}`}
      style={{
        minHeight: '250px',
        height: '100%',
        overflowY: 'auto',
        border: '1px solid #ced4da',
        borderRadius: '0.25rem',
        padding: '0.375rem 0.75rem',
        lineHeight: 1.5,
      }}      
      contentEditable={editable}
      onInput={handleInput}
      onPaste={handlePaste}
      suppressContentEditableWarning={true}
      data-placeholder={editable && isEmpty ? placeholder : undefined}
    >
      {isEmpty && !editable ? (
        <div className="moa-clause-placeholder-readonly">{placeholder || "No content available."}</div>
      ) : (
        <ol className="moa-clause-list">
          {items.map((itemString, index) => {
            const match = itemString.match(/^([ivx]+\.)\s*(.*)/is);
            let marker = "";
            let text = itemString;

            if (match) {
              marker = match[1];
              text = match[2] || "";
            } else if (items.length === 1 && !itemString.match(/^[ivx]+\.\s/i) && itemString.trim() !== '') {
              text = itemString;
              marker = "";
            }
            return (
              <li key={index}>
                {marker && <span className="moa-clause-marker">{marker}</span>}
                <span className="moa-clause-text">{text}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default MoaClauseDisplay;