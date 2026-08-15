import { Property } from '../types/property';

const API_BASE = '/api';

export async function fetchAllProperties(params?: Record<string, string>): Promise<Property[]> {
  try {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/properties?${queryString}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching properties:', err);
    return [];
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`);
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Error fetching property ${id}:`, err);
    return null;
  }
}
