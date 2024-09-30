import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import '../styles/Togglable.css';

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} className="toggle-button">
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} className="cancel-button">
          cancel
        </button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglabe';

export default Togglable;
