/**
 * ConfirmModal - Reusable confirmation dialog
 * @param {boolean} isOpen - Whether modal is visible
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Action on confirm
 * @param {Function} onCancel - Action on cancel
 */
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="admin-card" style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
