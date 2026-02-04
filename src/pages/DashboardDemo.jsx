import { useEffect, useState ,useRef} from 'react';

import SummaryCard from './SummaryCard.jsx';
import RecentExpenses from './RecentExpenses.jsx';
import TopCategories from './TopCategories.jsx';
import EmptyState from './EmptyState.jsx';

import { apiRequest } from '../components/api';
import helperConfig from '../components/helperConfig';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const pageStyle = {

    height: '82vh',
    background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
    paddingRight: '24px',
    paddingLeft: "24px",
    paddingBottom: "24px",
    paddingTop: "20px",
    overflowY: "auto",
    // marginBottom:"50px"
};

const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    //  overflowY:"auto"
};

const headerStyle = {
    textAlign: "left",
    marginBottom: '32px',
    // overflowY:"auto"
};

const titleStyle = {
    textAlign: "left",
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px',
};

const subtitleStyle = {
    color: '#6b7280',
};

const summaryGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
};

const contentGridStyle = {
    display: 'flex',
    gap: '16px',
};

const loaderWrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
};

const loaderStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    borderBottom: '3px solid #006F76',
    animation: 'spin 1s linear infinite',
};

function DashboardDemo() {
    const [demoMode, setDemoMode] = useState('full');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasFetched= useRef(false);
    // const month = new Date().getMonth() + 1;
    // const year = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    const month = selectedMonth.month() + 1;
const year = selectedMonth.year();

    const url = helperConfig();

    useEffect(() => {
    //      if(hasFetched.current) return;
    // hasFetched.current=true;
        fetchDashboardData();
    }, [selectedMonth,demoMode]);

  


    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const response = await apiRequest({
                method: 'get',
                url: `${url}/api/dashboard`,
                params: { month, year, demoMode },
                withCredentials: true,
            });

            if (response?.data.success) {
                setData(response.data.data);
            } else {
                setData(null);
            }
        } catch (err) {
            console.error(err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={loaderWrapperStyle}>
                <div style={loaderStyle} />
                <style>
                    {`@keyframes spin { to { transform: rotate(360deg); } }`}
                </style>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={pageStyle}>
                {/* <DemoModeSelector current={demoMode} onChange={()=>setDemoMode(mode)} /> */}
                <EmptyState type="error" />
            </div>
        );
    }

  const { hasBudget, hasExpenses, totalBudget, totalSpent, remaining,recentExpenses,hasAnyCategory,hasAnyExpense } = data;

  if (!hasAnyCategory && !hasAnyExpense) {
    console.log("No categories or expenses found",hasAnyCategory,hasAnyExpense)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <EmptyState type="nothing" />
      </div>
    );
  }
//   if (!hasBudget && !hasExpenses) {
//     return(
//      <div style={pageStyle}>
//                 {/* <h1 style={titleStyle}>Dashboard</h1> */}
//                 <div style={containerStyle}>
//                     {/* <DemoModeSelector current={demoMode} onChange={()=>setDemoMode(mode)} /> */}

//                     <div style={headerStyle}>
//                         {/* <h1 style={titleStyle}>Dashboard</h1> */}
//                         {/* <p style={subtitleStyle}>
//                     {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                     </p> */}
//                     </div>
//    <EmptyState type="emptyMonth" />
//    </div>
//             </div>
//     )
// }


    if (!hasBudget && hasExpenses) {
        return (
            <div style={pageStyle}>
                {/* <h1 style={titleStyle}>Dashboard</h1> */}
                <div style={containerStyle}>
                    {/* <DemoModeSelector current={demoMode} onChange={()=>setDemoMode(mode)} /> */}

                    <div style={headerStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div>
    <h1 style={titleStyle}>Dashboard</h1>
    <p style={subtitleStyle}>
      {selectedMonth.format('MMMM YYYY')}
    </p>
  </div>

  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      views={['year', 'month']}
      value={selectedMonth}
      onChange={(newValue) => {
        if (newValue) setSelectedMonth(newValue);
      }}
      slotProps={{
        textField: {
          size: 'small',
          sx: { width: 180 }
        }
      }}
    />
  </LocalizationProvider>
</div>

                        {/* <h1 style={titleStyle}>Dashboard</h1> */}
                        {/* <p style={subtitleStyle}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p> */}
                    </div>

                    <EmptyState type="noBudget" />

                    {data.recentExpenses?.length > 0 && (
                        <RecentExpenses expenses={data.recentExpenses} />
                    )}
                </div>
            </div>
        );
    }

    if (hasBudget && !hasExpenses) {
        return (
            <div style={pageStyle}>
                {/* <h1 style={titleStyle}>Dashboard</h1> */}
                <div style={containerStyle}>
                    {/* <DemoModeSelector current={demoMode} onChange={setDemoMode} /> */}

                    <div style={headerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div>
    <h1 style={titleStyle}>Dashboard</h1>
    <p style={subtitleStyle}>
      {selectedMonth.format('MMMM YYYY')}
    </p>
  </div>

  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      views={['year', 'month']}
      value={selectedMonth}
      onChange={(newValue) => {
        if (newValue) setSelectedMonth(newValue);
      }}
      slotProps={{
        textField: {
          size: 'small',
          sx: { width: 180 }
        }
      }}
    />
  </LocalizationProvider>
</div>

                        {/* <h1 style={titleStyle}>Dashboard</h1> */}
                        {/* <p style={subtitleStyle}>
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p> */}
                    </div>

                    <div style={summaryGridStyle}>
                        <SummaryCard title="Total Budget" value={`₹${totalBudget.toLocaleString('en-IN')}`} icon={<AccountBalanceWalletIcon />} />
                        <SummaryCard title="Total Spent" value={`₹${totalSpent.toLocaleString('en-IN')}`} icon={<CreditCardIcon />} />
                        <SummaryCard title="Remaining" value={`₹${remaining.toLocaleString('en-IN')}`} icon={remaining >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />} />
                        <SummaryCard title="Expenses Count" value="0" icon={<CalendarMonthIcon />} />
                    </div>

                    <EmptyState type="noExpense" />
                </div>
            </div>
        );
    }

    const expenseCount = data.recentExpenses.length;
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return (
        <div style={pageStyle}>
            {/* <h1 style={titleStyle}>Dashboard</h1> */}
            <div style={containerStyle}>
                {/* <DemoModeSelector current={demoMode} onChange={()=>setDemoMode(mode)} /> */}

                <div style={headerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div>
    <h1 style={titleStyle}>Dashboard</h1>
    <p style={subtitleStyle}>
      {selectedMonth.format('MMMM YYYY')}
    </p>
  </div>

  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      views={['year', 'month']}
      value={selectedMonth}
      onChange={(newValue) => {
        if (newValue) setSelectedMonth(newValue);
      }}
      slotProps={{
        textField: {
          size: 'small',
          sx: { width: 180 }
        }
      }}
    />
  </LocalizationProvider>
</div>

                    {/* <h1 style={titleStyle}>Dashboard</h1> */}
                    {/* <p style={subtitleStyle}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p> */}
                </div>

                <div style={summaryGridStyle}>
                    <SummaryCard title="Total Budget" value={`₹${totalBudget.toLocaleString('en-IN')}`} icon={<AccountBalanceWalletIcon />} />
                    <SummaryCard title="Total Spent" value={`₹${totalSpent.toLocaleString('en-IN')}`} subtitle={`${spentPercentage.toFixed(1)}% of budget`} icon={<CreditCardIcon />} />
                    <SummaryCard title="Remaining" value={`₹${remaining.toLocaleString('en-IN')}`} subtitle={remaining < 0 ? 'Budget exceeded!' : 'Available'} icon={remaining >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />} />
                    <SummaryCard title="Transactions" value={expenseCount.toString()} subtitle="This month" icon={<CalendarMonthIcon />} />
                </div>

                {/* <div style={contentGridStyle}>
          <TopCategories categories={data.topCategories} totalSpent={totalSpent} />
          <RecentExpenses expenses={data.recentExpenses} />
        </div> */}
                <div style={contentGridStyle}>
                    <div style={{ flex: 1 }}>
                        <TopCategories categories={data.topCategories} totalSpent={totalSpent} />
                    </div>

                    <div style={{ flex: 1 }}>
                        <RecentExpenses expenses={data.recentExpenses} />
                    </div>
                </div>

            </div>
        </div>
    );
}

function DemoModeSelector({ current, onChange }) {
    return (
        <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px', fontWeight: 500 }}>
                Demo Mode (for testing UI):
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['full', 'noBudget', 'noExpense', 'nothing'].map(mode => (
                    <button
                        key={mode}
                        onClick={() => onChange(mode)}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            background: current === mode ? '#006F76' : '#e5e7eb',
                            color: current === mode ? '#fff' : '#374151',
                        }}
                    >
                        {mode === 'full' && 'Full Dashboard'}
                        {mode === 'noBudget' && 'No Budget'}
                        {mode === 'noExpense' && 'No Expenses'}
                        {mode === 'nothing' && 'Nothing Added'}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DashboardDemo;
