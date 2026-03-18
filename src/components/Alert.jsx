import React from 'react';

const Alert = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="alert-area">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert alert-${alert.type} alert-dismissible fade show shadow`}
          role="alert"
        >
          <i className={`fas fa-${
            alert.type === 'success' ? 'check-circle' :
            alert.type === 'warning' ? 'exclamation-triangle' :
            alert.type === 'danger' ? 'times-circle' : 'info-circle'
          } me-2`}></i>
          {alert.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      ))}
    </div>
  );
};

export default Alert;