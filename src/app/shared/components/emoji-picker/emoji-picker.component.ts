import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface EmojiCategory {
  name: string;
  label: string;
  emojis: string[];
}

@Component({
  selector: 'app-emoji-picker',
  standalone: false,
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmojiPickerComponent),
      multi: true
    }
  ]
})
export class EmojiPickerComponent implements ControlValueAccessor {
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'Seleccionar emoji...';
  @Input() showCategories: boolean = true;

  @Output() emojiSelected = new EventEmitter<string>();

  selectedEmoji: string = '';
  searchTerm: string = '';
  selectedCategory: string = 'smileys';

  // Categorías básicas de emojis
  categories: EmojiCategory[] = [
    {
      name: 'smileys',
      label: 'Sonrisas',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩']
    },
    {
      name: 'emotions',
      label: 'Emociones',
      emojis: ['😥', '😢', '😭', '😤', '🥺', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧']
    },
    {
      name: 'hands',
      label: 'Manos',
      emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏']
    },
    {
      name: 'hearts',
      label: 'Corazones',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💋', '😍', '🥰', '😘', '💑', '💏', '👨‍❤️‍👨', '👩‍❤️‍👩', '💒']
    },
    {
      name: 'objects',
      label: 'Objetos',
      emojis: ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '📚', '📖', '📝', '✏️', '🖊️', '🖋️', '📏', '📐', '📎', '🔗', '📌', '📍', '🎯', '🎪', '🎨', '🎭', '🎪', '🎸', '🎵', '🎶', '🎤', '🎧', '📻', '📺']
    },
    {
      name: 'nature',
      label: 'Naturaleza',
      emojis: ['🌱', '🌿', '🍀', '🌵', '🌲', '🌳', '🌴', '🌾', '🌻', '🌺', '🌸', '🌼', '🌷', '🥀', '🌹', '🌪️', '🌈', '⭐', '🌟', '💫', '✨', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '❄️', '☃️']
    }
  ];

  // ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get filteredEmojis(): string[] {
    const category = this.categories.find(c => c.name === this.selectedCategory);
    if (!category) return [];

    if (!this.searchTerm) {
      return category.emojis;
    }

    // Filtro simple por posición en la lista (emojis similares suelen estar juntos)
    return category.emojis.filter((emoji, index) =>
      emoji.includes(this.searchTerm) ||
      index.toString().includes(this.searchTerm)
    );
  }

  selectEmoji(emoji: string) {
    this.selectedEmoji = emoji;
    this.onChange(emoji);
    this.onTouched();
    this.emojiSelected.emit(emoji);
  }

  selectCategory(categoryName: string) {
    this.selectedCategory = categoryName;
    this.searchTerm = '';
  }

  clearSelection() {
    this.selectedEmoji = '';
    this.onChange('');
    this.onTouched();
    this.emojiSelected.emit('');
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.selectedEmoji = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
