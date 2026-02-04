function SummaryCard({ title, value, icon, color = 'primary', subtitle }) {
  const colorStyles = {
    primary: { background: '#006F76', color: '#ffffff' },
    secondary: { background: '#977390', color: '#ffffff' },
    success: { background: '#10b981', color: '#ffffff' },
    danger: { background: '#ef4444', color: '#ffffff' },
    neutral: { background: '#475569', color: '#ffffff' },
  };

  const barStyles = {
    primary: '#006F761A',
    secondary: '#9773901A',
    success: '#ecfdf5',
    danger: '#fef2f2',
    neutral: '#f8fafc',
  };

  return (
    <div
      style={{
        textAlign:"left",
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.boxShadow =
          '0 8px 18px rgba(0,0,0,0.12)')
      }
      onMouseLeave={e =>
        (e.currentTarget.style.boxShadow =
          '0 4px 10px rgba(0,0,0,0.08)')
      }
    >
      <div style={{ padding: '15px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            marginTop:"0.5px"
          }}
        >
          <div
            style={{
              
              padding: '8px',
              borderRadius: '10px',
              ...colorStyles[color],
            }}
          >
            {icon}
          </div>
        </div>

        <h3
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#6b7280',
            marginBottom: '4px',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: subtitle ? '4px' : '0',
          }}
        >
          {value}
        </p>

        {subtitle && (
          <p
            style={{
              fontSize: '11px',
              color: '#6b7280',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          height: '4px',
          background: barStyles[color],
        }}
      />
    </div>
  );
}

export default SummaryCard;
