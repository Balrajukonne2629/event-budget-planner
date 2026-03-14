import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

const COLORS = [
  '#6366F1', '#EC4899', '#34D399', '#FBBF24',
  '#60A5FA', '#F97316', '#A78BFA', '#F87171'
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-lg text-sm">
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-indigo-600 font-bold">{formatCurrency(value)}</p>
      </div>
    );
  }
  return null;
};

const ExpenseChart = ({ expenses }) => {
  const data = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const grouped = expenses.reduce((acc, expense) => {
      const key = (expense.category || 'Other').trim();
      const amount = parseFloat(expense.amount) || 0;
      if (!acc[key]) acc[key] = 0;
      acc[key] += amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  if (!data.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <p className="text-gray-500 text-center text-sm">Add expenses to see category breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
        <span className="text-sm text-gray-500">By category</span>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={75}
              innerRadius={38}
              // ✅ Fix #5 — no padding when single slice (looks broken otherwise)
              paddingAngle={data.length > 1 ? 3 : 0}
              label={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: 500 }}>{value}</span>
              )}
              wrapperStyle={{ lineHeight: '22px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;