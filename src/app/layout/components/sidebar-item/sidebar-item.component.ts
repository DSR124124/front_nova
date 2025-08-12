import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
  standalone: false
})
export class SidebarItemComponent {
  @Input() item!: MenuItem;
  @Input() sidebarCollapsed: boolean = false;
  
  expanded = false;

  constructor(public router: Router) {}

  isActive(): boolean {
    if (!this.item.routerLink) return false;
    return this.router.url.startsWith(this.item.routerLink);
  }

  hasSubmenu(): boolean {
    return !!(this.item.items && this.item.items.length > 0);
  }

  isSubmenuActive(): boolean {
    if (!this.hasSubmenu()) return false;
    return this.item.items!.some(subItem => 
      subItem.routerLink && this.router.url.startsWith(subItem.routerLink)
    );
  }

  toggleSubmenu(): void {
    if (this.hasSubmenu()) {
      this.expanded = !this.expanded;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
