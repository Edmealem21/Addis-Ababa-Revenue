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
      className="fixed z-[999999] pointer-events-none -translate-x-1/2 -translate-y-full"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xl relative border border-slate-700 whitespace-nowrap">
        {message}
        <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>,
    document.body
  );
};

export default Tooltip;