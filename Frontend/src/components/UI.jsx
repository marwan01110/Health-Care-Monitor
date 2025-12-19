export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const baseClasses = 'font-semibold rounded-lg transition-colors';
  const variants = {
    primary: 'bg-medical-600 hover:bg-medical-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white',
    success: 'bg-success-600 hover:bg-success-700 text-white',
    outline: 'border-2 border-medical-600 text-medical-600 hover:bg-medical-50',
  };
  const sizes = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>{children}</div>;
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent transition ${
          error ? 'border-danger-400' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <select
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent transition ${
          error ? 'border-danger-400' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Badge({ variant = 'low', children }) {
  const variants = {
    low: 'bg-success-100 text-success-800',
    medium: 'bg-warning-100 text-warning-800',
    high: 'bg-danger-100 text-danger-800',
  };
  return <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]}`}>{children}</span>;
}

export function Alert({ type = 'info', children, onClose }) {
  const types = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-medical-50 border-medical-200 text-medical-800',
  };
  return (
    <div className={`border rounded-lg p-4 mb-4 flex justify-between items-center ${types[type]}`}>
      <span>{children}</span>
      {onClose && (
        <button onClick={onClose} className="font-bold">
          ✕
        </button>
      )}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
    </div>
  );
}

export function VitalCard({ label, value, unit, status = 'normal' }) {
  const statusColors = {
    normal: 'text-medical-600',
    warning: 'text-warning-600',
    critical: 'text-danger-600',
  };
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold">{label}</p>
      <p className={`text-3xl font-bold my-2 ${statusColors[status]}`}>{value}</p>
      <p className="text-sm text-gray-500">{unit}</p>
    </div>
  );
}
