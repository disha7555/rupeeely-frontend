// import PieChartIcon from '@mui/icons-material/PieChart';

// function TopCategories({ categories, totalSpent }) {
//   const colors = [
//     '#006F76',
//     '#977390',
//     '#4ECDC4',
//     '#FF6B6B',
//     '#FFE66D',
//   ];

//   const getCategoryPercentage = (spent) => {
//     if (totalSpent === 0) return 0;
//     return ((spent / totalSpent) * 100).toFixed(1);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">Top Categories</h2>
//         <PieChartIcon className="text-[#006F76]" />
//       </div>

//       <div className="space-y-4">
//         {categories.map((category, index) => {
//           const percentage = getCategoryPercentage(Number(category.spent));
//           const color = colors[index % colors.length];

//           return (
//             <div key={category.category_id} className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div
//                     className="w-3 h-3 rounded-full"
//                     style={{ backgroundColor: color }}
//                   ></div>
//                   <span className="font-medium text-gray-900">
//                     {category.category.name}
//                   </span>
//                 </div>

//                 <div className="text-right">
//                   <p className="font-bold text-gray-900">
//                     ₹{Number(category.spent).toLocaleString('en-IN')}
//                   </p>
//                   <p className="text-xs text-gray-500">{percentage}%</p>
//                 </div>
//               </div>

//               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                 <div
//                   className="h-full rounded-full transition-all duration-500"
//                   style={{
//                     width: `${percentage}%`,
//                     backgroundColor: color,
//                   }}
//                 ></div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {categories.length === 0 && (
//         <div className="text-center py-12">
//           <PieChartIcon className="text-gray-300 mx-auto mb-3" fontSize="large" />
//           <p className="text-gray-500">No category data available</p>
//         </div>
//       )}

//       {categories.length > 0 && (
//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium text-gray-600">Total Spent</span>
//             <span className="text-lg font-bold text-[#006F76]">
//               ₹{totalSpent.toLocaleString('en-IN')}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TopCategories;

import PieChartIcon from '@mui/icons-material/PieChart';

function TopCategories({ categories, totalSpent }) {
  const colors = ['#006F76', '#977390', '#4ECDC4', '#FF6B6B', '#FFE66D'];

  const getCategoryPercentage = spent => {
    if (totalSpent === 0) return 0;
    return ((spent / totalSpent) * 100).toFixed(1);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1f2937',
          }}
        >
          Top Categories
        </h2>
        <PieChartIcon style={{ color: '#006F76' }} />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {categories.map((category, index) => {
          const percentage = getCategoryPercentage(Number(category.spent));
          const color = colors[index % colors.length];

          return (
            <div key={category.category_id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: color,
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {category.category.name}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    ₹{Number(category.spent).toLocaleString('en-IN')}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {percentage}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: color,
                    borderRadius: '999px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <PieChartIcon
            style={{ color: '#d1d5db', fontSize: '40px', marginBottom: '12px' }}
          />
          <p style={{ color: '#6b7280' }}>No category data available</p>
        </div>
      )}

      {/* Footer */}
      {categories.length > 0 && (
        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#6b7280',
              }}
            >
              Total Spent
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#006F76',
              }}
            >
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopCategories;
