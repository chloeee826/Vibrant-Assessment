/**
 * TODO: Implement POST /api/samples
 * - Validate body: sampleId (pattern), collectionDate (<= now), sampleType, priority
 * - Return 201 on success with created resource or echo, else 400 with details
 * (Stretch) add attachments upload route.
 */
const express = require('express');
const router = express.Router();

// Mock lab samples data
const mockSamples = [];

router.post('/samples', (_req, res) => {
  const { sampleId, collectionDate, sampleType, priority } = req.body;
  
  // Field-level validation errors 
  const errors = {};

  // Validate sampleId with regex pattern ^[A-Z]-\d{3,5}$
  if (!sampleId) {
    errors.sampleId = 'Sample ID is required';
  } else if (!/^[A-Z]-\d{3,5}$/.test(sampleId)) {
    errors.sampleId = 'Sample ID must be format: A-123 (letter-dash-3to5digits)';
  }
  
  // Validate collectionDate (<= now)
  if (!collectionDate) {
    errors.collectionDate = 'Collection date is required';
  } else {
    const now = new Date();
    const collected = new Date(collectionDate);
    if (collected > now) {
      errors.collectionDate = 'Collection date cannot be in the future';
    }
  }

  // Validate sampleType
  if (!sampleType) {
    errors.sampleType = 'Sample type is required';
  } else {
    const validTypes = ['blood', 'urine', 'saliva', 'tissue', 'water', 'soil'];
    if (!validTypes.includes(sampleType)) {
      errors.sampleType = 'Invalid sample type';
    }
  }
  
  // Validate priority
  if (!priority) {
    errors.priority = 'Priority is required';
  } else {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      errors.priority = 'Invalid priority level';
    }
  }
  
  // Return field-level validation errors as details object
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      details: errors
    });
  }

  // Create new sample record
  const newSample = {
    id: Math.random().toString(36).substr(2, 9),
    sampleId,
    collectionDate,
    sampleType,
    priority
    createdAt: new Date().toISOString()
};

mockSamples.push(newSample);
return res.status(201).json(newSample);
});


module.exports = router;
