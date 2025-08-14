import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService, SidebarItem } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  isMobile = false;
  menuItems: SidebarItem[] = [];

  constructor(
    public router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.loadMenuItems();
    this.checkScreenSize();
  }

  private loadMenuItems() {
    this.sidebarService.getMenuItems().subscribe(items => {
      this.menuItems = items;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile && !this.collapsed) {
      this.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  hasSubmenu(item: SidebarItem): boolean {
    return !!(item.items && item.items.length > 0);
  }

  isSubmenuActive(item: SidebarItem): boolean {
    if (!this.hasSubmenu(item)) return false;
    return item.items!.some(subItem =>
      subItem.routerLink && this.router.url.startsWith(subItem.routerLink)
    );
  }


}
