/**
 * TODO: Implement test results endpoints
 * - GET /api/test-results
 * - PATCH /api/test-results/:id {status}
 * - (Stretch) POST /api/test-results with Idempotency-Key header
 * Include validation & error handling. Frontend uses optimistic updates.
 */
const express = require('express');
const router = express.Router();

// Mock lab test result data
let mockTestResults = [
  {
    id: '1',
    name: 'Blood Glucose Test',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2', 
    name: 'Cholesterol Test',
    status: 'pending',
    createdAt: '2024-01-16T10:30:00Z',
    updatedAt: '2024-01-16T10:30:00Z'
  },
  {
    id: '3',
    name: 'COVID-19 PCR Test',
    status: 'in-progress',
    createdAt: '2024-01-17T10:30:00Z',
    updatedAt: '2024-01-17T10:30:00Z'
  }
];


/**
 * @route   GET /api/test-results
 * @desc    Get all test results
 */
router.get('/test-results', (req, res) => {
  try {
    return res.status(200).json(mockTestResults);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PATCH /api/test-results/:id
 * @desc    Update test result status
 */
router.patch('/test-results/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID
    const index = mockTestResults.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    // Validate status
    if (!status || !['pending', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update status
    mockTestResults[index].status = status;

    return res.status(200).json(mockTestResults[index]);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/test-results
 * @desc    Add a new test result (idempotent)
 */
router.post('/test-results', (req, res) => {
  try {
    const { patientName, testName, result, unit, referenceRange, date, status } = req.body;

    // Validate required fields
    if (!patientName || !testName || !result) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new test result
    const newTest = {
      id: mockTestResults.length + 1,
      patientName,
      testName,
      result,
      unit: unit || '',
      referenceRange: referenceRange || 'N/A',
      date: date || new Date().toISOString(),
      status: status || 'pending',
    };

    mockTestResults.push(newTest);

    return res.status(201).json(newTest);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
