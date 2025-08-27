/**
 * TODO: Implement GET /api/maintenance/:equipmentId
 * - Protect with requireAuth
 * - Validate equipmentId (positive integer) and query params: page/pageSize
 * - Query with Knex; return { equipment, records, page, pageSize, total }
 * - Sort by performed_at DESC
 */
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Mock database data 
const mockMaintenanceData = {
  '1': {
    equipment: { id: '1', name: 'Centrifuge Model X', type: 'Laboratory Equipment' },
    records: [
      { id: 1, equipment_id: '1', performed_at: '2024-02-15T10:30:00Z', type: 'routine', status: 'completed' },
      { id: 2, equipment_id: '1', performed_at: '2024-02-10T14:45:00Z', type: 'repair', status: 'pending' },
      { id: 3, equipment_id: '1', performed_at: '2024-02-05T09:15:00Z', type: 'calibration', status: 'completed' },
      { id: 4, equipment_id: '1', performed_at: '2024-01-30T11:00:00Z', type: 'routine', status: 'in-progress' },
      { id: 5, equipment_id: '1', performed_at: '2024-01-25T16:30:00Z', type: 'repair', status: 'pending' }
    ]
  },
  '2': {
    equipment: { id: '2', name: 'Microscope Pro', type: 'Optical Equipment' },
    records: [
      { id: 6, equipment_id: '2', performed_at: '2024-02-12T13:20:00Z', type: 'calibration', status: 'completed' },
      { id: 7, equipment_id: '2', performed_at: '2024-02-08T10:45:00Z', type: 'routine', status: 'completed' }
    ]
  }
};

// Validation middleware
const validateEquipmentId = (req, res, next) => {
  const { equipmentId } = req.params;
  const id = parseInt(equipmentId);
  
  if (!equipmentId || isNaN(id) || id <= 0) {
    return res.status(400).json({ 
      message: 'Equipment ID must be a positive integer',
      details: { equipment_id: 'INVALID', performed_at: null }
    });
  }
  
  req.validatedEquipmentId = id.toString();
  next();
};

const validateQueryParams = (req, res, next) => {
  let { page = 1, pageSize = 20 } = req.query;
  
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  
  if (isNaN(page) || page < 1) {
    return res.status(400).json({
      message: 'Page must be a positive integer',
      details: { equipment_id: req.params.equipmentId, performed_at: null }
    });
  }
  
  if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
    return res.status(400).json({
      message: 'Page size must be between 1 and 100',
      details: { equipment_id: req.params.equipmentId, performed_at: null }
    });
  }
  
  req.pagination = { page, pageSize };
  next();
};

router.get('/maintenance/:equipmentId', requireAuth, validateEquipmentId, validateQueryParams, (req, res) => {
  try {
    const { validatedEquipmentId } = req;
    const { page, pageSize } = req.pagination;
    
    // Check if equipment exists
    const equipmentData = mockMaintenanceData[validatedEquipmentId];
    if (!equipmentData) {
      return res.status(404).json({
        message: 'Equipment not found',
        details: { equipment_id: validatedEquipmentId, performed_at: null }
      });
    }
    
    const { equipment, records } = equipmentData;
    
    // Sort by performed_at DESC (most recent first)
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
    );
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = sortedRecords.slice(startIndex, endIndex);
    
    // Return response in required format
    res.json({
      equipment,
      records: paginatedRecords,
      page,
      pageSize,
      total: records.length
    });
    
  } catch (error) {
    console.error('Maintenance API error:', error);
    res.status(500).json({
      message: 'Internal server error',
      details: { equipment_id: req.params.equipmentId, performed_at: null }
    });
  }
});

module.exports = router;
