import { 
  AIIntent, 
  AIChatRequest, 
  AIChatResponse, 
  ExtractedCriteria, 
  ChatRoleMessage 
} from '../types/ai';
import { IProperty } from '../types/property';
import Property from '../models/Property';
import mongoose from 'mongoose';
import { INITIAL_PROPERTIES } from '../seed/propertySeed';
import { vectorSearchRankProperties } from './vectorSearchService';

/**
 * 1. Intent Detection Logic
 */
export function detectIntent(message: string, history?: ChatRoleMessage[]): AIIntent {
  const lower = message.toLowerCase();

  // Follow-up check or details check
  if (
    lower.includes('first one') ||
    lower.includes('second one') ||
    lower.includes('third one') ||
    lower.includes('tell me more about') ||
    lower.includes('property details') ||
    lower.includes('more details on') ||
    lower.includes('view this property')
  ) {
    return 'PROPERTY_DETAILS';
  }

  // Market / location trends check
  if (
    lower.includes('market') ||
    lower.includes('trend') ||
    lower.includes('appreciation') ||
    lower.includes('investment') ||
    lower.includes('price trend') ||
    lower.includes('forecast')
  ) {
    return 'MARKET_INSIGHT';
  }

  // Property search check
  if (
    lower.includes('find') ||
    lower.includes('search') ||
    lower.includes('show me') ||
    lower.includes('looking for') ||
    lower.includes('bedroom') ||
    lower.includes('bed') ||
    lower.includes('under') ||
    lower.includes('budget') ||
    lower.includes('apartment') ||
    lower.includes('villa') ||
    lower.includes('condo') ||
    lower.includes('house') ||
    lower.includes('penthouse') ||
    lower.includes('townhouse') ||
    lower.includes('cheap') ||
    lower.includes('luxury')
  ) {
    return 'PROPERTY_SEARCH';
  }

  // Default to general question if asking advice/process
  return 'REAL_ESTATE_QUESTION';
}

/**
 * 2. Extract Search Criteria from Natural Language
 */
export function extractCriteria(message: string, context?: Record<string, any>): ExtractedCriteria {
  const lower = message.toLowerCase();
  const criteria: ExtractedCriteria = {};

  // Extract bedrooms
  const bedMatch = lower.match(/(\d+)\s*(?:-| )*(?:bed|bedroom|bhk)/);
  if (bedMatch) {
    criteria.bedrooms = parseInt(bedMatch[1], 10);
  }

  // Extract price (e.g. under $500,000, under 500k, 500000)
  const priceMatch = lower.match(/(?:under|below|less than|max|budget of)\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|thousand|million|m)?/);
  if (priceMatch) {
    let priceNum = parseFloat(priceMatch[1].replace(/,/g, ''));
    const unit = priceMatch[2];
    if (unit === 'k' || unit === 'thousand') {
      priceNum *= 1000;
    } else if (unit === 'm' || unit === 'million') {
      priceNum *= 1000000;
    }
    criteria.maxPrice = priceNum;
  } else {
    // Check raw dollar amounts
    const dollarMatch = lower.match(/\$(\d+(?:,\d+)*)/);
    if (dollarMatch) {
      criteria.maxPrice = parseFloat(dollarMatch[1].replace(/,/g, ''));
    }
  }

  // Extract locations
  const locations = ['downtown', 'midtown', 'uptown', 'city center', 'waterfront'];
  for (const loc of locations) {
    if (lower.includes(loc)) {
      criteria.location = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }

  // Extract property type
  const types = ['apartment', 'condo', 'villa', 'house', 'penthouse', 'townhouse'];
  for (const t of types) {
    if (lower.includes(t)) {
      criteria.propertyType = t;
      break;
    }
  }

  // Extract property index mention (e.g. "first one", "second one")
  if (lower.includes('first') || lower.includes('1st')) {
    criteria.propertyIndexMentioned = 0;
  } else if (lower.includes('second') || lower.includes('2nd')) {
    criteria.propertyIndexMentioned = 1;
  } else if (lower.includes('third') || lower.includes('3rd')) {
    criteria.propertyIndexMentioned = 2;
  }

  // Merge with existing context if provided
  if (context) {
    if (!criteria.location && context.location) criteria.location = context.location;
    if (!criteria.propertyType && context.propertyType) criteria.propertyType = context.propertyType;
    if (!criteria.maxPrice && context.maxPrice) criteria.maxPrice = context.maxPrice;
    if (!criteria.bedrooms && context.bedrooms) criteria.bedrooms = context.bedrooms;
  }

  return criteria;
}

/**
 * 3. Query Database + Vector Similarity Ranking
 */
export async function searchDatabaseProperties(userQuery: string, criteria: ExtractedCriteria): Promise<IProperty[]> {
  let candidates: IProperty[] = [];

  // If MongoDB is connected, query database
  if (mongoose.connection.readyState === 1) {
    try {
      const query: any = { status: 'for_sale' };

      if (criteria.location) {
        query.location = { $regex: new RegExp(criteria.location, 'i') };
      }

      if (criteria.propertyType) {
        query.propertyType = criteria.propertyType;
      }

      if (criteria.bedrooms) {
        query.bedrooms = criteria.bedrooms;
      }

      if (criteria.maxPrice) {
        query.price = { $lte: criteria.maxPrice };
      }

      const results = await Property.find(query).limit(20).lean();
      if (results.length > 0) {
        candidates = results as unknown as IProperty[];
      }
    } catch (err) {
      console.warn('Database query fallback to seed dataset:', err);
    }
  }

  // Fallback to seed dataset if candidates empty
  if (candidates.length === 0) {
    candidates = INITIAL_PROPERTIES.filter(p => {
      if (criteria.location && !p.location.toLowerCase().includes(criteria.location.toLowerCase())) {
        return false;
      }
      if (criteria.propertyType && p.propertyType !== criteria.propertyType) {
        return false;
      }
      if (criteria.bedrooms && p.bedrooms !== criteria.bedrooms) {
        return false;
      }
      if (criteria.maxPrice && p.price > criteria.maxPrice) {
        return false;
      }
      return true;
    });
  }

  // Apply Vector Similarity Ranking over candidate listings
  return vectorSearchRankProperties(candidates, userQuery, criteria);
}

/**
 * 4. Call Groq / LLM API
 */
async function callLLMProvider(
  systemPrompt: string, 
  userMessage: string, 
  history?: ChatRoleMessage[]
): Promise<string | null> {
  const apiKey = process.env.AI_API_KEY || '';
  const modelName = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
  const providerUrl = process.env.AI_PROVIDER_URL || 'https://api.groq.com/openai/v1/chat/completions';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: 0.5,
        max_tokens: 800
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer) return answer;
    } else {
      const errText = await response.text();
      console.warn('Groq API response error:', response.status, errText);
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn('AI LLM Provider error:', err.message);
  }

  return null;
}

/**
 * 5. Master AI Chat Processing Service
 */
export async function processAIChat(reqData: AIChatRequest): Promise<AIChatResponse> {
  const { message, history, context } = reqData;
  
  // Detect intent
  const intent = detectIntent(message, history);
  
  // Extract criteria
  const criteria = extractCriteria(message, context);
  
  let properties: IProperty[] = [];
  let answer = '';

  if (intent === 'PROPERTY_SEARCH') {
    properties = await searchDatabaseProperties(message, criteria);
    
    if (properties.length === 0) {
      answer = `I searched our property database using vector feature matching but couldn't find any exact listings for your query ${criteria.location ? `in **${criteria.location}**` : ''} ${criteria.bedrooms ? `with **${criteria.bedrooms} bedrooms**` : ''} ${criteria.maxPrice ? `under **$${criteria.maxPrice.toLocaleString()}**` : ''}.\n\nWould you like me to broaden the price range or check nearby locations?`;
    } else {
      const systemPrompt = `You are a professional Real Estate Property Expert. Introduce these retrieved vector-matched listings warmly using markdown: ${JSON.stringify(properties.slice(0, 3).map(p => ({ title: p.title, price: p.price, location: p.location, beds: p.bedrooms, rating: p.rating })))}. Highlight their key advantages in bullet points.`;
      
      const llmAnswer = await callLLMProvider(systemPrompt, message, history);
      
      if (llmAnswer) {
        answer = llmAnswer;
      } else {
        const summaryList = properties
          .slice(0, 3)
          .map((p, idx) => `**${idx + 1}. ${p.title}**\n- Price: $${p.price.toLocaleString()}\n- Specs: ${p.bedrooms} Beds • ${p.bathrooms} Baths • ${p.area.toLocaleString()} sqft\n- Location: ${p.location}\n- Rating: ⭐ ${p.rating}/5`)
          .join('\n\n');

        answer = `I found **${properties.length} properties** matching your search criteria via Vector Similarity Ranking:\n\n${summaryList}\n\nFeel free to ask for more details on any of these listings or schedule a viewing!`;
      }
    }
  } else if (intent === 'PROPERTY_DETAILS') {
    const searchContextProps = context?.lastProperties || INITIAL_PROPERTIES;
    let targetProperty: IProperty | undefined;

    if (criteria.propertyIndexMentioned !== undefined && searchContextProps[criteria.propertyIndexMentioned]) {
      targetProperty = searchContextProps[criteria.propertyIndexMentioned];
    } else {
      const lowerMsg = message.toLowerCase();
      targetProperty = searchContextProps.find((p: IProperty) => 
        lowerMsg.includes(p.title.toLowerCase()) || lowerMsg.includes(p.location.toLowerCase())
      ) || searchContextProps[0];
    }

    if (targetProperty) {
      properties = [targetProperty];
      const systemPrompt = `You are a top Real Estate Advisor. Provide a comprehensive, structured markdown breakdown for property: ${JSON.stringify(targetProperty)}. Cover Location, Price, Key Specs, Description, and Amenities. Ask if the user wants to schedule a viewing.`;
      const llmAnswer = await callLLMProvider(systemPrompt, message, history);
      
      if (llmAnswer) {
        answer = llmAnswer;
      } else {
        answer = `### 🏠 ${targetProperty.title}\n\n**Location:** ${targetProperty.location} (${targetProperty.address})\n**Price:** $${targetProperty.price.toLocaleString()}\n**Key Details:** ${targetProperty.bedrooms} Bedrooms | ${targetProperty.bathrooms} Bathrooms | ${targetProperty.area.toLocaleString()} sqft | Year Built: ${targetProperty.yearBuilt || 'N/A'}\n\n**Description:**\n${targetProperty.description}\n\n**Key Amenities & Features:**\n${targetProperty.features.map(f => `- ${f}`).join('\n')}\n\nWould you like to schedule a virtual tour or contact the listing agent?`;
      }
    } else {
      answer = `Could you please specify which property you would like to inspect? You can refer to "the first property" or search by name.`;
    }
  } else if (intent === 'MARKET_INSIGHT') {
    const loc = criteria.location || 'Downtown';
    const systemPrompt = `You are a Senior Real Estate Market Analyst. Provide detailed market insights, price per sqft trends, ROI potential, and investment advice for location "${loc}" using markdown headers and bullet points.`;
    
    const llmAnswer = await callLLMProvider(systemPrompt, message, history);
    if (llmAnswer) {
      answer = llmAnswer;
    } else {
      answer = `### 📊 Real Estate Market Insights — ${loc}\n\n- **Average Price per Sqft:** $265/sqft (Up +4.2% YoY)\n- **Demand Trends:** Strong buyer interest for modern 2 and 3-bedroom luxury apartments.\n- **Rental Yields:** Estimated 6.5% - 7.2% annual return on investment.\n- **Inventory Status:** Moderate inventory with average days-on-market around 28 days.\n\nInvesting in **${loc}** offers great long-term equity growth due to ongoing infrastructure developments and proximity to business hubs.`;
    }
  } else {
    // REAL_ESTATE_QUESTION
    const systemPrompt = `You are an expert Real Estate Advisor. Answer the user's real estate question thoroughly, accurately, and professionally using clear markdown formatting.`;
    
    const llmAnswer = await callLLMProvider(systemPrompt, message, history);
    if (llmAnswer) {
      answer = llmAnswer;
    } else {
      answer = `### 💡 Key Advice for Property Buyers\n\nWhen evaluating real estate investments, consider the following core factors:\n\n1. **Location & Accessibility:** Proximity to work, quality schools, public transit, and amenities heavily dictates future resale value.\n2. **Financing & Pre-Approval:** Secure mortgage pre-approval before shopping to establish a clear budget limit.\n3. **Property Inspection:** Always hire a certified inspector to examine foundation, plumbing, HVAC, and electrical systems.\n4. **Market Trends & Resale Potential:** Research neighborhood appreciation rates over the last 3-5 years.\n\nLet me know if you have specific questions about mortgage options or inspection checklists!`;
    }
  }

  return {
    success: true,
    intent,
    answer,
    properties,
    context: {
      ...context,
      location: criteria.location || context?.location,
      bedrooms: criteria.bedrooms || context?.bedrooms,
      maxPrice: criteria.maxPrice || context?.maxPrice,
      propertyType: criteria.propertyType || context?.propertyType,
      lastProperties: properties.length > 0 ? properties : context?.lastProperties
    }
  };
}
