import React from 'react';
import ReactDOM from 'react-dom';

const Tooltip = ({ children, targetRef, visible, message, offset = 12 }) => {
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (visible && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - offset,
        left: rect.left + rect.width / 2,
      });
    }
  }, [visible, targetRef, offset]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div
      className="tooltip-portal"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%) translateY(-100%)',
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    >
      <div className="tooltip-content">
        {message}
        <span className="tooltip-arrow" />
      </div>
    </div>,
    document.body
  );
};

export default Tooltip;