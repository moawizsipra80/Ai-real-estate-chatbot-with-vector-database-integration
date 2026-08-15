import { IProperty } from '../types/property';
import { ExtractedCriteria } from '../types/ai';

const FEATURE_VOCABULARY = [
  'balcony', 'city view', 'park view', 'fitness center', 'gym', 'parking', 
  'pool', 'swimming pool', 'smart home', 'ev charger', 'high ceilings', 
  'exposed brick', 'pet friendly', 'waterfront', 'infinity pool', 'private dock', 
  'home theater', 'wine cellar', 'rooftop', 'terrace', 'hot tub', 'private elevator', 
  'garden', 'fireplace', 'garage', 'near schools', 'downtown', 'midtown', 
  'uptown', 'waterfront', 'city center', 'luxury'
];

/**
 * Convert property into a normalized 32-dimensional feature vector
 */
export function generatePropertyVector(property: IProperty): number[] {
  const vector = new Array(FEATURE_VOCABULARY.length).fill(0);

  // 1. Text & keyword features
  const textBlob = `${property.title} ${property.description} ${property.location} ${property.propertyType} ${property.features.join(' ')}`.toLowerCase();
  
  FEATURE_VOCABULARY.forEach((kw, idx) => {
    if (textBlob.includes(kw)) {
      vector[idx] = 1.0;
    }
  });

  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
}

/**
 * Convert user query & extracted criteria into a query vector
 */
export function generateQueryVector(query: string, criteria: ExtractedCriteria): number[] {
  const vector = new Array(FEATURE_VOCABULARY.length).fill(0);
  const textBlob = `${query} ${criteria.location || ''} ${criteria.propertyType || ''}`.toLowerCase();

  FEATURE_VOCABULARY.forEach((kw, idx) => {
    if (textBlob.includes(kw)) {
      vector[idx] = 1.0;
    }
  });

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
}

/**
 * Cosine similarity between vector A and vector B
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Perform Vector Similarity Search & Ranking over candidate properties
 */
export function vectorSearchRankProperties(
  properties: IProperty[],
  userQuery: string,
  criteria: ExtractedCriteria
): IProperty[] {
  const queryVec = generateQueryVector(userQuery, criteria);

  // If query vector is empty, return properties sorted by rating/price
  const isQueryVectorEmpty = queryVec.every(v => v === 0);
  if (isQueryVectorEmpty) {
    return properties;
  }

  // Calculate similarity score for each property
  const scoredProps = properties.map(prop => {
    const propVec = generatePropertyVector(prop);
    const similarity = cosineSimilarity(queryVec, propVec);
    return { prop, similarity };
  });

  // Sort by highest similarity score
  scoredProps.sort((a, b) => b.similarity - a.similarity);

  return scoredProps.map(item => item.prop);
}
