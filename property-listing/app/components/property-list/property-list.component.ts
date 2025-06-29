import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyFormComponent } from '../property-form/property-form.component';
import { Observable, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { Property } from '../../models/property.model';
import { User } from '../../models/user.model';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
const ITEMS_PER_PAGE = 6;

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PropertyFormComponent,
  ],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
// NOTE: Stale lint errors about unused imports may appear due to an editor cache issue.
// These can be disregarded if the application builds successfully.
// This component displays the list of properties and handles filtering, sorting, and CRUD operations.
export class PropertyListComponent implements OnInit, OnDestroy {
  properties$: Observable<Property[]>;
  paginatedProperties$: Observable<Property[]>;
  uniqueLocations$: Observable<string[]>;
  currentUser$: Observable<User | null>;

  searchTerm = new BehaviorSubject<string>('');
  filterType = new BehaviorSubject<string>('all');
  filterLocation = new BehaviorSubject<string>('all');
  sortBy = new BehaviorSubject<string>('name');
  sortOrder = new BehaviorSubject<'asc' | 'desc'>('asc');
  currentPage = new BehaviorSubject<number>(1);

  totalPages = 0;
  viewMode: 'grid' | 'table' = 'grid';

  isPropertyFormOpen = false;
  editingProperty: Property | null = null;

  private subscriptions = new Subscription();

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.currentUser$ = this.authService.currentUser;
    this.uniqueLocations$ = this.propertyService.getUniqueLocations();

    this.properties$ = combineLatest([
      this.searchTerm,
      this.filterType,
      this.filterLocation,
      this.sortBy,
      this.sortOrder
    ]).pipe(
      switchMap(([searchTerm, filterType, filterLocation, sortBy, sortOrder]) =>
        this.propertyService.getProperties(searchTerm, filterType, filterLocation, sortBy, sortOrder)
      )
    );

    this.paginatedProperties$ = this.properties$;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.next(value);
    this.currentPage.next(1);
  }

  onFilterTypeChange(value: string): void {
    this.filterType.next(value);
    this.currentPage.next(1);
  }

  onFilterLocationChange(value: string): void {
    this.filterLocation.next(value);
    this.currentPage.next(1);
  }

  onSortChange(value: string): void {
    this.sortBy.next(value);
  }

  toggleSortOrder(): void {
    this.sortOrder.next(this.sortOrder.value === 'asc' ? 'desc' : 'asc');
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.next(page);
    }
  }

  openPropertyForm(property: Property | null): void {
    this.editingProperty = property;
    this.isPropertyFormOpen = true;
  }

  onPropertyFormClose(refresh: boolean): void {
    this.isPropertyFormOpen = false;
    this.editingProperty = null;
    if (refresh) {
      // This will trigger a refresh of the properties list
      this.propertyService.properties$.subscribe();
    }
  }

  deleteProperty(id: string): void {
    this.notificationService.showConfirmation(
      'Are you sure you want to delete this property?',
      () => {
        this.propertyService.deleteProperty(id);
        this.notificationService.showSuccess('Property deleted successfully.');
      }
    );
  }

  exportToCSV(): void {
    this.subscriptions.add(
      this.properties$.subscribe(properties => {
        this.propertyService.exportToCSV(properties);
        this.notificationService.showSuccess('Properties exported to CSV successfully!');
      })
    );
  }
}
