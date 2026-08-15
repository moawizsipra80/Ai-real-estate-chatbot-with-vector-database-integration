import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { validateAIChatRequest } from '../validators/aiChatValidator';
import { processAIChat } from '../services/aiService';
import Property from '../models/Property';
import { INITIAL_PROPERTIES } from '../seed/propertySeed';

/**
 * POST /api/ai/chat
 * Primary AI Chat Assistant endpoint
 */
export async function chatWithAI(req: Request, res: Response): Promise<void> {
  try {
    // 1. Request Validation & Sanitization
    const validation = validateAIChatRequest(req.body);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error || 'Invalid request payload.'
      });
      return;
    }

    const sanitizedPayload = {
      message: validation.sanitizedMessage!,
      history: req.body.history || [],
      context: req.body.context || {}
    };

    // 2. Process AI Logic (Intent Detection, Property Query, AI Response)
    const result = await processAIChat(sanitizedPayload);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in chatWithAI controller:', error);
    
    // Ensure secrets/stack traces are NEVER exposed to client
    res.status(500).json({
      success: false,
      message: 'An internal error occurred while processing your AI chat request. Please try again later.'
    });
  }
}

/**
 * POST /api/ai/chat/stream
 * Bonus SSE Streaming endpoint for real-time response
 */
export async function streamChatWithAI(req: Request, res: Response): Promise<void> {
  try {
    const validation = validateAIChatRequest(req.body);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error || 'Invalid request payload.'
      });
      return;
    }

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sanitizedPayload = {
      message: validation.sanitizedMessage!,
      history: req.body.history || [],
      context: req.body.context || {}
    };

    const result = await processAIChat(sanitizedPayload);

    // Stream text chunks
    const text = result.answer;
    const chunkSize = 15;
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize);
      res.write(`data: ${JSON.stringify({ type: 'text', chunk })}\n\n`);
      await new Promise(r => setTimeout(r, 40)); // Smooth streaming typing simulation
    }

    // Send final payload with properties & intent
    res.write(`data: ${JSON.stringify({ 
      type: 'done', 
      intent: result.intent, 
      properties: result.properties,
      context: result.context 
    })}\n\n`);

    res.end();
  } catch (error: any) {
    console.error('Error in streamChatWithAI:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Streaming error occurred.' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Stream failed' })}\n\n`);
      res.end();
    }
  }
}

/**
 * GET /api/properties
 * List all properties with optional filter
 */
export async function getProperties(req: Request, res: Response): Promise<void> {
  try {
    const { location, propertyType, minPrice, maxPrice, bedrooms } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        const query: any = { status: 'for_sale' };

        if (location) query.location = { $regex: new RegExp(location as string, 'i') };
        if (propertyType) query.propertyType = propertyType;
        if (bedrooms) query.bedrooms = parseInt(bedrooms as string, 10);
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = parseFloat(minPrice as string);
          if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
        }

        const properties = await Property.find(query).lean();
        if (properties.length > 0) {
          res.status(200).json({ success: true, count: properties.length, data: properties });
          return;
        }
      } catch (e) {
        // Fallback if DB query fails
      }
    }

    // Fallback seed filtering
    const filtered = INITIAL_PROPERTIES.filter(p => {
      if (location && !p.location.toLowerCase().includes((location as string).toLowerCase())) return false;
      if (propertyType && p.propertyType !== propertyType) return false;
      if (bedrooms && p.bedrooms !== parseInt(bedrooms as string, 10)) return false;
      if (maxPrice && p.price > parseFloat(maxPrice as string)) return false;
      return true;
    });

    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve properties.' });
  }
}

/**
 * GET /api/properties/:id
 * Get single property by ID
 */
export async function getPropertyById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (mongoose.connection.readyState === 1) {
      try {
        const property = await Property.findById(id).lean();
        if (property) {
          res.status(200).json({ success: true, data: property });
          return;
        }
      } catch (e) {}
    }

    const foundSeed = INITIAL_PROPERTIES.find(p => p._id === id);
    if (foundSeed) {
      res.status(200).json({ success: true, data: foundSeed });
      return;
    }

    res.status(404).json({ success: false, message: 'Property not found.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch property details.' });
  }
}

/**
 * POST /api/properties
 * Create a new property listing
 */
export async function createProperty(req: Request, res: Response): Promise<void> {
  try {
    const newProperty = new Property(req.body);
    const saved = await newProperty.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Invalid property payload.' });
  }
}
