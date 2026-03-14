import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

const SkeletonRow = () => (
  <div className="px-6 py-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-100 rounded w-20"></div>
      </div>
      <div className="flex space-x-3">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense, loading = false }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ category: '', amount: '' });

  // ✅ Fix #1 — skeleton loader while expenses are fetching
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
        <div className="divide-y">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Expenses (0)</h3>
        </div>
        <div className="text-center py-12 px-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No expenses recorded yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "+ Add Expense" to get started</p>
          </div>
        </div>
      </div>
    );
  }

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({ category: expense.category, amount: expense.amount.toString() });
  };

  // ✅ Fix #9 — warn before discarding unsaved edits
  const cancelEdit = (expense) => {
    const isDirty =
      editData.category !== expense.category ||
      editData.amount !== expense.amount.toString();

    if (isDirty && !window.confirm('Discard unsaved changes?')) return;
    setEditingId(null);
    setEditData({ category: '', amount: '' });
  };

  const handleEditSubmit = async (expenseId) => {
    try {
      const amount = parseFloat(editData.amount);
      if (Number.isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
      }
      await onEditExpense(expenseId, { category: editData.category, amount });
      setEditingId(null);
      setEditData({ category: '', amount: '' });
    } catch (error) {
      console.error('Error editing expense:', error);
      alert('Failed to update expense');
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await onDeleteExpense(expenseId);
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Expenses ({expenses.length})</h3>
      </div>

      <div className="divide-y">
        {expenses.map((expense) => (
          <div key={expense._id} className="px-6 py-4">
            {editingId === expense._id ? (
              <div className="space-y-3">
                <input
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Category"
                />
                <input
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditSubmit(expense._id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Save
                  </button>
                  {/* ✅ Fix #9 — pass expense so cancelEdit can check dirty state */}
                  <button
                    onClick={() => cancelEdit(expense)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{expense.category}</p>
                  <p className="text-red-600 font-bold">{formatCurrency(expense.amount)}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => startEdit(expense)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 flex justify-between font-bold">
        <span className="text-gray-700">Total</span>
        <span className="text-red-600">
          {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
        </span>
      </div>
    </div>
  );
};

export default ExpenseList;