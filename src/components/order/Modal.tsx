import React from 'react';
//ts-ignore
const Modal = ({ show, onClose, children }: { show: boolean, onClose: () => void, children: React.ReactNode }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button style={{
            backgroundColor: '#20b4d3',
            padding: '8px 20px',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            }} 
        >Print</button>
        <button 
        style={{
            backgroundColor: '#FC3A39',
            padding: '8px 20px',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            marginLeft: '10px',
            }}
        onClick={onClose}>Close</button>
      </section>
    </div>
  );
};

export default Modal;
