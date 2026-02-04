import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function EmptyState({ type }) {
  const states = {
    nothing: {
      icon: <AutoAwesomeIcon style={{ fontSize: 64, color: '#006F76' }} />,
      title: 'Welcome to Your Expense Tracker!',
      message:
        'Get started by adding your first category and expense to track your spending.',
      hint: 'Quick Guide: Create category → Add expense → Set budget',
    },
    emptyMonth: {
  icon: <ReceiptLongIcon style={{ fontSize: 64, color: '#977390' }} />,
  title: 'No Activity This Month',
  message:
    'You don’t have any expenses or budget recorded for this month.',
  hint:
    ' Add a new expense to get started.',
},

    noBudget: {
      icon: (
        <AccountBalanceWalletIcon
          style={{ fontSize: 64, color: '#977390' }}
        />
      ),
      title: 'No Budget Added Yet',
      message:
        'Add a budget to track your spending and see how much you have remaining.',
      hint: 'Use the navigation menu to create your monthly budget',
    },
    noExpense: {
      icon: <ReceiptLongIcon style={{ fontSize: 64, color: '#006F76' }} />,
      title: 'No Expenses Yet',
      message: 'Start tracking your spending by adding your first expense.',
      hint: 'Use the navigation menu to add a new expense',
    },
    error: {
      icon: <TrendingUpIcon style={{ fontSize: 64, color: '#ef4444' }} />,
      title: 'Unable to Load Data',
      message:
        'There was an error loading your dashboard. Please try refreshing the page.',
      hint: '',
    },
  };

  const state = states[type];

  const styles = {
    container: {
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      padding: 32,
      textAlign: 'center',
      maxWidth: 400,
      margin: '0 auto 24px auto',
    },
    iconWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: 12,
    },
    message: {
      fontSize: 14,
      color: '#4b5563',
      marginBottom: 24,
      lineHeight: 1.6,
    },
    hintBox: {
      background:
        'linear-gradient(90deg, rgba(0,111,118,0.1), rgba(151,115,144,0.1))',
      borderRadius: 12,
      padding: 16,
      border: '1px solid rgba(0,111,118,0.2)',
    },
    hintText: {
      fontSize: 14,
      fontWeight: 500,
      color: '#374151',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.iconWrapper}>{state.icon}</div>

      <h2 style={styles.title}>{state.title}</h2>

      <p style={styles.message}>{state.message}</p>

      {state.hint && (
        <div style={styles.hintBox}>
          <p style={styles.hintText}>{state.hint}</p>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
