import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import ExpenseList from '../components/ExpenseList';
import SummaryCard from '../components/SummaryCard';
import ExpenseChart from '../components/ExpenseChart';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // ✅ Fix #6 — removed stale 'description' field
  const [expenseFormData, setExpenseFormData] = useState({ category: '', amount: '' });

  const fetchEventData = useCallback(async () => {
    try {
      setLoading(true);
      const [expensesResponse, summaryResponse] = await Promise.all([
        eventsAPI.getEventExpenses(id),
        eventsAPI.getBudgetSummary(id)
      ]);
      setEvent({ _id: id, eventName: summaryResponse.data.eventName, budget: summaryResponse.data.budget });
      setExpenses(expensesResponse.data);
      setSummary(summaryResponse.data);
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event data:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseData = { ...expenseFormData, amount: parseFloat(expenseFormData.amount) };
      await eventsAPI.addExpense(id, expenseData);
      // ✅ Fix #6 — clean reset matches state shape
      setExpenseFormData({ category: '', amount: '' });
      setShowExpenseForm(false);
      fetchEventData();
    } catch (err) {
      setError('Failed to add expense');
      console.error('Error adding expense:', err);
    }
  };

  const handleExpenseInputChange = (e) => {
    setExpenseFormData({ ...expenseFormData, [e.target.name]: e.target.value });
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.deleteEvent(id);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete event');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await eventsAPI.deleteExpense(id, expenseId);
      // ✅ Fix #8 — refetch after delete so summary stays in sync
      await fetchEventData();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete expense';
      setError(message);
      console.error('Error deleting expense:', err);
    }
  };

  const handleEditExpense = async (expenseId, updatedData) => {
    try {
      const response = await eventsAPI.editExpense(id, expenseId, updatedData);
      const updatedExpense = response.data;
      setExpenses((prev) => prev.map((e) => (e._id === expenseId ? updatedExpense : e)));
      // keep summary in sync optimistically
      setSummary((prev) => {
        if (!prev) return prev;
        const totalExpenses = expenses
          .map((e) => (e._id === expenseId ? updatedExpense : e))
          .reduce((sum, e) => sum + (e.amount || 0), 0);
        return { ...prev, totalExpenses, remainingBudget: prev.budget - totalExpenses };
      });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update expense';
      setError(message);
      console.error('Error updating expense:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-red-800 mb-6 text-lg font-medium">{error}</div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-indigo-600 hover:text-indigo-500 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{event?.eventName}</h1>
              <p className="text-gray-600 text-lg">Manage your event expenses and budget</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {showExpenseForm ? 'Cancel' : '+ Add Expense'}
              </button>
              <button
                onClick={handleDeleteEvent}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Fix #2 — dismissible error banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-400 hover:text-red-600 text-lg font-bold leading-none"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {showExpenseForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                    Category *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    required
                    value={expenseFormData.category}
                    onChange={handleExpenseInputChange}
                    placeholder="e.g., Food, Transportation, Venue"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    value={expenseFormData.amount}
                    onChange={handleExpenseInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowExpenseForm(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SummaryCard summary={summary} />
          </div>
          <div className="lg:col-span-1">
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
            />
          </div>
          <div className="lg:col-span-1">
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;