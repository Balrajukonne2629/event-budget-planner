const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getBudgetSummary,
} = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("Event routes loaded");

router.post("/", authMiddleware, createEvent);
router.get("/", authMiddleware, getEvents);

router.post("/:id/expenses", authMiddleware, addExpense);
router.get("/:id/expenses", authMiddleware, getExpenses);
router.put("/:id/expenses/:expenseId", authMiddleware, updateExpense);
router.delete("/:id/expenses/:expenseId", authMiddleware, deleteExpense);

router.get("/:id/summary", authMiddleware, getBudgetSummary);

router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;