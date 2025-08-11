import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

interface EmojiCategory {
  name: string;
  icon: string;
  emojis: string[];
}

@Component({
  selector: 'app-emoji-selector',
  standalone: false,
  templateUrl: './emoji-selector.component.html',
  styleUrl: './emoji-selector.component.css'
})
export class EmojiSelectorComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() maxRecentEmojis: number = 20;
  @Output() emojiSelected = new EventEmitter<string>();
  @Output() selectorClosed = new EventEmitter<void>();

  selectedCategory: string = 'recientes';
  searchTerm: string = '';
  recentEmojis: string[] = [];

  emojiCategories: EmojiCategory[] = [
    {
      name: 'recientes',
      icon: '🕐',
      emojis: []
    },
    {
      name: 'caras',
      icon: '😀',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
        '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
        '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
        '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
        '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'
      ]
    },
    {
      name: 'corazones',
      icon: '❤️',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
        '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
        '💌', '💋', '💍', '💎', '🌹', '🌺', '🌻', '🌷', '🌸', '💐'
      ]
    },
    {
      name: 'gestos',
      icon: '👋',
      emojis: [
        '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
        '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
        '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'
      ]
    },
    {
      name: 'animales',
      icon: '🐶',
      emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
        '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
        '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
        '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'
      ]
    },
    {
      name: 'comida',
      icon: '🍎',
      emojis: [
        '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑',
        '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒',
        '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖',
        '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗'
      ]
    },
    {
      name: 'deportes',
      icon: '⚽',
      emojis: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
        '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
        '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️',
        '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺'
      ]
    },
    {
      name: 'viajes',
      icon: '🚗',
      emojis: [
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
        '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁',
        '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '⛵', '🚤', '🛥️', '🛳️',
        '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️', '🏖️', '🏝️'
      ]
    },
    {
      name: 'objetos',
      icon: '📱',
      emojis: [
        '📱', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿',
        '📀', '📼', '📷', '📸', '📹', '🎥', '📞', '☎️', '📟', '📠',
        '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️',
        '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯'
      ]
    }
  ];

  ngOnInit(): void {
    this.loadRecentEmojis();
    this.updateRecentCategory();
  }

  selectEmoji(emoji: string): void {
    this.emojiSelected.emit(emoji);
    this.addToRecent(emoji);
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.searchTerm = '';
  }

  closeSelector(): void {
    this.selectorClosed.emit();
  }

  searchEmojis(): void {
    if (!this.searchTerm.trim()) {
      this.selectedCategory = 'recientes';
      return;
    }

    // Buscar en todas las categorías
    const searchResults: string[] = [];
    const searchLower = this.searchTerm.toLowerCase();

    this.emojiCategories.forEach(category => {
      if (category.name !== 'recientes') {
        category.emojis.forEach(emoji => {
          if (this.emojiMatchesSearch(emoji, searchLower)) {
            searchResults.push(emoji);
          }
        });
      }
    });

    // Crear categoría temporal de resultados
    const searchCategory = this.emojiCategories.find(c => c.name === 'busqueda');
    if (searchCategory) {
      searchCategory.emojis = searchResults;
    } else {
      this.emojiCategories.push({
        name: 'busqueda',
        icon: '🔍',
        emojis: searchResults
      });
    }

    this.selectedCategory = 'busqueda';
  }

  private emojiMatchesSearch(emoji: string, searchTerm: string): boolean {
    // Simple coincidencia por emoji o descripción básica
    const emojiDescriptions: { [key: string]: string[] } = {
      '😀': ['sonrisa', 'feliz', 'alegre'],
      '😍': ['amor', 'enamorado', 'corazones'],
      '😂': ['risa', 'llorar', 'gracioso'],
      '❤️': ['corazon', 'amor', 'rojo'],
      '👍': ['pulgar', 'bien', 'ok'],
      '🎉': ['fiesta', 'celebrar', 'confeti'],
      '🔥': ['fuego', 'genial', 'increible']
    };

    const descriptions = emojiDescriptions[emoji] || [];
    return descriptions.some(desc => desc.includes(searchTerm));
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCategory = 'recientes';
    // Remover categoría de búsqueda
    this.emojiCategories = this.emojiCategories.filter(c => c.name !== 'busqueda');
  }

  getCurrentEmojis(): string[] {
    const category = this.emojiCategories.find(c => c.name === this.selectedCategory);
    return category ? category.emojis : [];
  }

  private addToRecent(emoji: string): void {
    // Remover si ya existe
    this.recentEmojis = this.recentEmojis.filter(e => e !== emoji);

    // Agregar al inicio
    this.recentEmojis.unshift(emoji);

    // Mantener límite
    if (this.recentEmojis.length > this.maxRecentEmojis) {
      this.recentEmojis = this.recentEmojis.slice(0, this.maxRecentEmojis);
    }

    this.updateRecentCategory();
    this.saveRecentEmojis();
  }

  private updateRecentCategory(): void {
    const recentCategory = this.emojiCategories.find(c => c.name === 'recientes');
    if (recentCategory) {
      recentCategory.emojis = [...this.recentEmojis];
    }
  }

  private loadRecentEmojis(): void {
    try {
      const saved = localStorage.getItem('recent_emojis');
      if (saved) {
        this.recentEmojis = JSON.parse(saved);
      } else {
        // Emojis por defecto si no hay recientes
        this.recentEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😍', '😊'];
      }
    } catch (error) {
      console.error('Error loading recent emojis:', error);
      this.recentEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😍', '😊'];
    }
  }

  private saveRecentEmojis(): void {
    try {
      localStorage.setItem('recent_emojis', JSON.stringify(this.recentEmojis));
    } catch (error) {
      console.error('Error saving recent emojis:', error);
    }
  }

  getCategoryIcon(categoryName: string): string {
    const category = this.emojiCategories.find(c => c.name === categoryName);
    return category ? category.icon : '📂';
  }

  getCategoryDisplayName(categoryName: string): string {
    const names: { [key: string]: string } = {
      'recientes': 'Recientes',
      'caras': 'Caras',
      'corazones': 'Corazones',
      'gestos': 'Gestos',
      'animales': 'Animales',
      'comida': 'Comida',
      'deportes': 'Deportes',
      'viajes': 'Viajes',
      'objetos': 'Objetos',
      'busqueda': 'Resultados'
    };
    return names[categoryName] || categoryName;
  }

  hasEmojis(): boolean {
    return this.getCurrentEmojis().length > 0;
  }
}
