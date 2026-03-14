import React from 'react';
import { formatCurrency } from '../utils/formatters';

const SummaryCard = ({ summary }) => {
  if (!summary) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const { budget, totalExpenses, remainingBudget } = summary;
  const isOverBudget = remainingBudget < 0;
  const expensePercentage = budget > 0 ? Math.min((totalExpenses / budget) * 100, 100) : 0;

  const progressColor = isOverBudget
    ? 'bg-gradient-to-r from-red-500 to-red-600'
    : expensePercentage >= 75
    ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
    : 'bg-gradient-to-r from-green-500 to-emerald-500';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Budget Summary
        </h3>
      </div>

      <div className="p-6 space-y-6">

        {/* Stat cards — stacked on small width, side-by-side only when space allows */}
        <div className="grid grid-cols-1 gap-3">

          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <span className="text-sm font-semibold text-green-700">Total Budget</span>
            <span className="text-base font-bold text-green-600 tabular-nums">
              {formatCurrency(budget)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
            <span className="text-sm font-semibold text-red-700">Total Expenses</span>
            <span className="text-base font-bold text-red-500 tabular-nums">
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-xl border ${
            isOverBudget
              ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
          }`}>
            <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-700' : 'text-blue-700'}`}>
              Remaining Budget
            </span>
            <span className={`text-base font-bold tabular-nums ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
              {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remainingBudget))}
            </span>
          </div>

        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">Expense Progress</span>
            <span className="font-semibold text-gray-900">{expensePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ease-out ${progressColor}`}
              style={{ width: `${expensePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Over budget warning */}
        {isOverBudget && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-800 text-sm font-medium">
                Budget exceeded by {formatCurrency(Math.abs(remainingBudget))}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SummaryCard;