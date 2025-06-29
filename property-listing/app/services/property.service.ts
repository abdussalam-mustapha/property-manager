import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Property } from '../models/property.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private propertiesSubject: BehaviorSubject<Property[]>;
  public properties$: Observable<Property[]>;

  constructor(private localStorageService: LocalStorageService) {
    const savedProperties = this.localStorageService.getItem<Property[]>('properties');
    if (savedProperties && savedProperties.length > 0) {
      this.propertiesSubject = new BehaviorSubject<Property[]>(savedProperties);
    } else {
      const sampleProperties = this.getSampleProperties();
      this.propertiesSubject = new BehaviorSubject<Property[]>(sampleProperties);
      this.localStorageService.setItem('properties', sampleProperties);
    }
    this.properties$ = this.propertiesSubject.asObservable();

    this.properties$.subscribe(properties => {
        this.localStorageService.setItem('properties', properties);
    });
  }

  private getSampleProperties(): Property[] {
    return [
      {
        id: '1',
        name: 'Modern Downtown Apartment',
        type: 'Apartment',
        location: 'Downtown',
        price: 2500,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        description: 'Beautiful modern apartment in the heart of downtown',
        dateAdded: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Suburban Family House',
        type: 'House',
        location: 'Suburbs',
        price: 4500,
        bedrooms: 4,
        bathrooms: 3,
        area: 2400,
        description: 'Spacious family home with large backyard',
        dateAdded: new Date().toISOString()
      }
    ];
  }

  getProperties(
    searchTerm: string,
    filterType: string,
    filterLocation: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Observable<Property[]> {
    return this.properties$.pipe(
      map(properties => {
        let filtered = properties.filter(property => {
          const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               property.location.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesType = filterType === 'all' || property.type === filterType;
          const matchesLocation = filterLocation === 'all' || property.location === filterLocation;
          return matchesSearch && matchesType && matchesLocation;
        });

        filtered.sort((a, b) => {
          let aValue: any = a[sortBy as keyof Property];
          let bValue: any = b[sortBy as keyof Property];
          
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });

        return filtered;
      })
    );
  }

  getUniqueLocations(): Observable<string[]> {
      return this.properties$.pipe(
          map(properties => [...new Set(properties.map(p => p.location))])
      );
  }

  addProperty(propertyData: Omit<Property, 'id' | 'dateAdded'>): void {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    const currentProperties = this.propertiesSubject.value;
    this.propertiesSubject.next([...currentProperties, newProperty]);
  }

  updateProperty(updatedProperty: Property): void {
    const currentProperties = this.propertiesSubject.value;
    const updatedProperties = currentProperties.map(p =>
      p.id === updatedProperty.id ? updatedProperty : p
    );
    this.propertiesSubject.next(updatedProperties);
  }

  deleteProperty(id: string): void {
    const currentProperties = this.propertiesSubject.value;
    const updatedProperties = currentProperties.filter(p => p.id !== id);
    this.propertiesSubject.next(updatedProperties);
  }

  exportToCSV(properties: Property[]): void {
    const headers = ['Name', 'Type', 'Location', 'Price', 'Bedrooms', 'Bathrooms', 'Area', 'Description'];
    const csvContent = [
      headers.join(','),
      ...properties.map(property => [
        `"${property.name}"`,
        property.type,
        `"${property.location}"`,
        property.price,
        property.bedrooms,
        property.bathrooms,
        property.area,
        `"${property.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}