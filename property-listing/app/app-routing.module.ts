import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from './components/property-list/property-list.component';

const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: '**', redirectTo: '' } // Redirect any other path to the main list
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
