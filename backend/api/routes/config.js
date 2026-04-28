import express from 'express';
import { DEPARTMENTS, PRIORITY_LEVELS, STATUS_LEVELS } from '../config/departments.js';

const router = express.Router();

/**
 * GET /api/config
 * Get application configuration (departments, priorities, statuses)
 * No auth required - public configuration
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        departments: DEPARTMENTS,
        priorities: PRIORITY_LEVELS,
        statuses: STATUS_LEVELS,
        priorityConfig: {
          low: { label: 'Low', color: 'priority-low' },
          medium: { label: 'Medium', color: 'priority-medium' },
          high: { label: 'High', color: 'priority-high' },
          urgent: { label: 'Urgent', color: 'priority-urgent' },
        },
        statusConfig: {
          submitted: { label: 'Submitted', color: 'status-submitted' },
          assigned: { label: 'Assigned', color: 'status-assigned' },
          in_progress: { label: 'In Progress', color: 'status-in-progress' },
          resolved: { label: 'Resolved', color: 'status-resolved' },
          closed: { label: 'Closed', color: 'status-closed' },
          rejected: { label: 'Rejected', color: 'status-rejected' },
        },
      },
    });
  } catch (error) {
    console.error('Error getting config:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get configuration',
    });
  }
});

export default router;

