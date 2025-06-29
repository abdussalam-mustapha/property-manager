export interface Property {
  id: string;
  name: string;
  type: 'Apartment' | 'House' | 'Condo' | 'Townhouse' | 'Commercial';
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  dateAdded: string;
}
