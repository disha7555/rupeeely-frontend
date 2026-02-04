import CreditCardIcon from '@mui/icons-material/CreditCard';

const RecentExpenses = ({ expenses }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const styles = {
    container: {
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      padding: 24,
      marginBottom:"20px"
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: 600,
      color: '#1f2937',
    },
    item: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      background: '#f8fafc',
      transition: 'background 0.2s ease',
      marginBottom: 12,
    },
    itemHover: {
      background: '#f1f5f9',
    },
    description: {
      fontSize: 16,
      fontWeight: 500,
      color: '#111827',
      marginBottom: 6,
      textTransform: "capitalize"
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      background: '#977390',
      color: '#fff',
    },
    amount: {
      fontSize: 18,
      fontWeight: 700,
      color: '#006F76',
      textAlign: 'right',
    },
    meta: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 12,
      color: '#6b7280',
      gap: 12,
      marginTop: 10,
    },
    emptyState: {
      textAlign: 'center',
      padding: 48,
    },
    emptyIcon: {
      fontSize: 48,
      color: '#cbd5e1',
      marginBottom: 12,
    },
    emptyText: {
      color: '#6b7280',
      fontSize: 14,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Recent Expenses</h2>
        <CreditCardIcon style={{ color: '#006F76', fontSize: 20 }} />
      </div>

      <div>
        {expenses.slice(0, 10).map((expense) => (
          <div
            key={expense.id}
            style={styles.item}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F2F7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={styles.description}>{expense.description || "Expense"}</h3>
                  <p style={{ margin: 0 }}>
                    <span style={styles.badge}>{expense.category.name}</span>
                  </p>
                </div>
                <div style={{ marginLeft: 16 }}>
                  <p style={styles.amount}>
                    ₹{expense.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div style={styles.meta}>
                <span>{formatDate(expense.expense_date)}</span>
                <span>•</span>
                <span>{formatTime(expense.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {expenses.length === 0 && (
        <div style={styles.emptyState}>
          <CreditCardIcon style={styles.emptyIcon} />
          <p style={styles.emptyText}>No expenses recorded yet</p>
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;
