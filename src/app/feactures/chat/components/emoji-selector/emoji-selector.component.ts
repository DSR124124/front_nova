import { Component, Output, EventEmitter, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

interface EmojiCategory {
  name: string;
  icon: string;
  emojis: string[];
  description?: string;
}

@Component({
  selector: 'app-emoji-selector',
  standalone: false,
  templateUrl: './emoji-selector.component.html',
  styleUrl: './emoji-selector.component.css'
})
export class EmojiSelectorComponent implements OnInit, AfterViewInit {
  @Input() visible: boolean = false;
  @Input() maxRecentEmojis: number = 20;
  @Output() emojiSelected = new EventEmitter<string>();
  @Output() selectorClosed = new EventEmitter<void>();

  @ViewChild('categoriesScroll') categoriesScroll!: ElementRef;
  @ViewChild('emojiContent') emojiContent!: ElementRef;

  selectedCategory: string = 'recientes';
  searchTerm: string = '';
  recentEmojis: string[] = [];
  isLoading: boolean = false;
  isClosing: boolean = false;
  selectedEmojis: Set<string> = new Set();

  emojiCategories: EmojiCategory[] = [
    {
      name: 'recientes',
      icon: '🕐',
      emojis: [],
      description: 'Emojis utilizados recientemente'
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
      ],
      description: 'Expresiones faciales y emociones'
    },
    {
      name: 'corazones',
      icon: '❤️',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
        '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
        '💌', '💋', '💍', '💎', '🌹', '🌺', '🌻', '🌷', '🌸', '💐'
      ],
      description: 'Símbolos de amor y romance'
    },
    {
      name: 'gestos',
      icon: '👋',
      emojis: [
        '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
        '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
        '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'
      ],
      description: 'Gestos con las manos'
    },
    {
      name: 'animales',
      icon: '🐶',
      emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
        '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
        '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
        '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'
      ],
      description: 'Animales domésticos y salvajes'
    },
    {
      name: 'comida',
      icon: '🍎',
      emojis: [
        '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑',
        '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒',
        '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖',
        '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗'
      ],
      description: 'Frutas, verduras y alimentos'
    },
    {
      name: 'deportes',
      icon: '⚽',
      emojis: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
        '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
        '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️',
        '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺'
      ],
      description: 'Deportes y actividades físicas'
    },
    {
      name: 'viajes',
      icon: '🚗',
      emojis: [
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
        '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁',
        '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '⛵', '🚤', '🛥️', '🛳️',
        '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️', '🏖️', '🏝️'
      ],
      description: 'Medios de transporte y destinos'
    },
    {
      name: 'objetos',
      icon: '📱',
      emojis: [
        '📱', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿',
        '📀', '📼', '📷', '📸', '📹', '🎥', '📞', '☎️', '📟', '📠',
        '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️',
        '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯'
      ],
      description: 'Tecnología y objetos cotidianos'
    }
  ];

  ngOnInit(): void {
    this.loadRecentEmojis();
    this.updateRecentCategory();
  }

  ngAfterViewInit(): void {
    // Scroll automático a la categoría activa
    this.scrollToActiveCategory();
  }

  selectEmoji(emoji: string): void {
    this.emojiSelected.emit(emoji);
    this.addToRecent(emoji);
    this.selectedEmojis.add(emoji);

    // Efecto visual de selección
    setTimeout(() => {
      this.selectedEmojis.delete(emoji);
    }, 600);
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.searchTerm = '';
    this.scrollToActiveCategory();
  }

  closeSelector(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.selectorClosed.emit();
      this.isClosing = false;
    }, 200);
  }

  searchEmojis(): void {
    if (!this.searchTerm.trim()) {
      this.selectedCategory = 'recientes';
      return;
    }

    // Simular carga
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 300);

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
        emojis: searchResults,
        description: 'Resultados de búsqueda'
      });
    }

    this.selectedCategory = 'busqueda';
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCategory = 'recientes';
    // Remover categoría de búsqueda
    this.emojiCategories = this.emojiCategories.filter(c => c.name !== 'busqueda');
  }

  clearRecentEmojis(): void {
    this.recentEmojis = [];
    this.updateRecentCategory();
    localStorage.removeItem('recent_emojis');
  }

  getCurrentEmojis(): string[] {
    const category = this.emojiCategories.find(c => c.name === this.selectedCategory);
    return category ? category.emojis : [];
  }

  getCategoryDescription(categoryName: string): string | undefined {
    const category = this.emojiCategories.find(c => c.name === categoryName);
    return category?.description;
  }

  isEmojiSelected(emoji: string): boolean {
    return this.selectedEmojis.has(emoji);
  }

  trackByCategory(index: number, category: EmojiCategory): string {
    return category.name;
  }

  trackByEmoji(index: number, emoji: string): string {
    return emoji;
  }

  private scrollToActiveCategory(): void {
    if (this.categoriesScroll) {
      setTimeout(() => {
        const activeBtn = this.categoriesScroll.nativeElement.querySelector('.category-btn.active');
        if (activeBtn) {
          activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 100);
    }
  }

  private emojiMatchesSearch(emoji: string, searchTerm: string): boolean {
    // Simple coincidencia por emoji o descripción básica
    const emojiDescriptions: { [key: string]: string[] } = {
      '😀': ['sonrisa', 'feliz', 'alegre', 'happy', 'smile'],
      '😍': ['amor', 'enamorado', 'corazones', 'love', 'heart'],
      '😂': ['risa', 'llorar', 'gracioso', 'laugh', 'funny'],
      '❤️': ['corazon', 'amor', 'rojo', 'heart', 'love'],
      '👍': ['pulgar', 'bien', 'ok', 'thumbs', 'good'],
      '🎉': ['fiesta', 'celebrar', 'confeti', 'party', 'celebrate'],
      '🔥': ['fuego', 'genial', 'increible', 'fire', 'awesome'],
      '😊': ['sonrisa', 'feliz', 'contento', 'smile', 'happy'],
      '🥰': ['enamorado', 'amor', 'feliz', 'love', 'happy'],
      '😘': ['beso', 'amor', 'romantico', 'kiss', 'love']
    };

    const descriptions = emojiDescriptions[emoji] || [];
    return descriptions.some(desc => desc.includes(searchTerm));
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
