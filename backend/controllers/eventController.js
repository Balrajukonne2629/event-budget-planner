const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const { eventName, budget, location, date } = req.body;
    const event = new Event({ userId: req.user.id, eventName, budget, location, date });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { eventName, budget, location, date } = req.body;

    // ✅ Fix #3 — use ?? so budget:0 is valid
    event.eventName = eventName ?? event.eventName;
    event.budget    = budget    ?? event.budget;
    event.location  = location  ?? event.location;
    event.date      = date      ?? event.date;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const { category, amount } = req.body;
    event.expenses.push({ category, amount });
    await event.save();
    res.json(event.expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event.expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id, expenseId } = req.params;
    const event = await Event.findOne({ _id: id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const expense = event.expenses.id(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    expense.deleteOne();
    await event.save();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id, expenseId } = req.params;
    const { category, amount } = req.body;
    const event = await Event.findOne({ _id: id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const expense = event.expenses.id(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (category !== undefined) expense.category = category;
    if (amount !== undefined) expense.amount = amount;
    await event.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBudgetSummary = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const totalExpenses = event.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBudget = event.budget - totalExpenses;
    res.json({ eventName: event.eventName, budget: event.budget, totalExpenses, remainingBudget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent, getEvents, updateEvent, deleteEvent,
  addExpense, getExpenses, updateExpense, deleteExpense, getBudgetSummary
};