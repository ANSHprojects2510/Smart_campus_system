import express from "express";
import Assignment from "../models/Assignment.js";
import { protect, roleCheck } from "./authMiddleware.js";

const router = express.Router();

// Teacher creates assignment
router.post("/add", protect, roleCheck("teacher"), async (req, res) => {
  try {
    const { title, description, course } = req.body;

    const newAssignment = new Assignment({
      title,
      description,
      course,
      createdBy: req.user.id,
    });

    await newAssignment.save();
    res.status(201).json({ message: "Assignment created", assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student fetches assignments
router.get("/", protect, roleCheck("student", "teacher", "admin"), async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

