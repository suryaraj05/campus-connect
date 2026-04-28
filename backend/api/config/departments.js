/**
 * Campus-specific departments
 * Same infrastructure/maintenance departments as village app, but for campus context
 */

export const DEPARTMENTS = [
  'Municipal Cleanliness',      // Garbage, waste, cleaning issues on campus
  'Electrical Department',       // Power outages, electrical hazards, street lights
  'Water Department',            // Water supply, leaks, drainage, flooding
  'Roads & Infrastructure',      // Potholes, road damage, pathways, sidewalks
  'Health & Sanitation'          // Public health issues, sanitation problems, medical emergencies
];

export const PRIORITY_LEVELS = ['low', 'medium', 'high', 'urgent'];

export const STATUS_LEVELS = [
  'submitted',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'rejected'
];

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'priority-low' },
  medium: { label: 'Medium', color: 'priority-medium' },
  high: { label: 'High', color: 'priority-high' },
  urgent: { label: 'Urgent', color: 'priority-urgent' }
};

export const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'status-submitted' },
  assigned: { label: 'Assigned', color: 'status-assigned' },
  in_progress: { label: 'In Progress', color: 'status-in-progress' },
  resolved: { label: 'Resolved', color: 'status-resolved' },
  closed: { label: 'Closed', color: 'status-closed' },
  rejected: { label: 'Rejected', color: 'status-rejected' }
};
