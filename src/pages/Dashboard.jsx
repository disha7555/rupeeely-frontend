import React, { useEffect, useState } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import SummaryCard from './SummaryCard';
import RecentExpenses from './RecentExpenses';
import TopCategories from './TopCategories';
import EmptyState from './EmptyState';

import { apiRequest } from '../components/api';
import helperConfig from '../components/helperConfig';

const Dashboard=()=>{
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toasting, setToasing] = useState(false);
  const [toastMsg, setToastMsg] = useState({ type: "", msg: "" });

  const [month] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());

  const url = helperConfig();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await apiRequest({
        method: "get",
        url: `${url}/api/dashboard`,
        params: {
          month,
          year,
        },
        withCredentials: true,
      });

      if (response?.success) {
        setData(response.data);
      } else {
        setToasing(true);
        setToastMsg({ type: "error", msg: "Failed to load dashboard data" });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setToasing(true);
      setToastMsg({ type: "error", msg: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006F76]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
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
  if (!hasBudget && !hasExpenses) {
  return <EmptyState type="emptyMonth" />;
}


  if (!hasBudget && hasExpenses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <EmptyState type="noBudget" />

          {data.recentExpenses.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
              <RecentExpenses expenses={data.recentExpenses} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (hasBudget && !hasExpenses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Total Budget"
              value={`₹${totalBudget.toLocaleString('en-IN')}`}
              icon={<AccountBalanceWalletIcon />}
              color="primary"
            />
            <SummaryCard
              title="Total Spent"
              value={`₹${totalSpent.toLocaleString('en-IN')}`}
              icon={<CreditCardIcon />}
              color="secondary"
            />
            <SummaryCard
              title="Remaining"
              value={`₹${remaining.toLocaleString('en-IN')}`}
              icon={remaining >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              color={remaining >= 0 ? 'success' : 'danger'}
            />
            <SummaryCard
              title="Expenses Count"
              value="0"
              icon={<CalendarMonthIcon />}
              color="neutral"
            />
          </div>

          <EmptyState type="noExpense" />
        </div>
      </div>
    );
  }

  const expenseCount = data.recentExpenses.length;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Budget"
            value={`₹${totalBudget.toLocaleString('en-IN')}`}
            icon={<AccountBalanceWalletIcon />}
            color="primary"
          />
          <SummaryCard
            title="Total Spent"
            value={`₹${totalSpent.toLocaleString('en-IN')}`}
            icon={<CreditCardIcon />}
            color="secondary"
            subtitle={`${spentPercentage.toFixed(1)}% of budget`}
          />
          <SummaryCard
            title="Remaining"
            value={`₹${remaining.toLocaleString('en-IN')}`}
            icon={remaining >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            color={remaining >= 0 ? 'success' : 'danger'}
            subtitle={remaining < 0 ? 'Budget exceeded!' : 'Available'}
          />
          <SummaryCard
            title="Transactions"
            value={expenseCount.toString()}
            icon={<CalendarMonthIcon />}
            color="neutral"
            subtitle="This month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopCategories categories={data.topCategories} totalSpent={totalSpent} />
          <RecentExpenses expenses={data.recentExpenses} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
