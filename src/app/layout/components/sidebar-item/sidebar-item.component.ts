import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
  standalone: false
})
export class SidebarItemComponent {
  @Input() item!: MenuItem;
  @Input() depth: number = 0;
  @Input() index: number = 0;
  @Input() expanded: boolean = false;
  @Input() currentExpandedItemIndex: number[] = [];
  @Input() sidebarCollapsed: boolean = false;

  @Output() expandChange = new EventEmitter<{ index: number; expanded: boolean }>();

  toggleExpand() {
    if (this.item.items && this.item.items.length > 0) {
      this.expanded = !this.expanded;
      this.expandChange.emit({ index: this.index, expanded: this.expanded });
    }
  }

  onExpandChange(event: { index: number; expanded: boolean }) {
    this.expandChange.emit(event);
  }

  hasChildren(): boolean {
    return this.item.items !== undefined && this.item.items.length > 0;
  }

  getPaddingLeft(): string {
    return `${this.depth * 20}px`;
  }
}
