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

  constructor(private router: Router) {}

  isActive(): boolean {
    if (!this.item.routerLink) return false;
    return this.router.url.startsWith(this.item.routerLink);
  }
}
