import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css'],
  standalone: false
})
export class MessageInputComponent implements OnInit {
  @Input() placeholder: string = 'Escribe un mensaje...';
  @Input() messageText: string = '';
  @Input() disabled: boolean = false;
  @Input() maxLength: number = 1000;
  @Input() showCharacterCount: boolean = true;
  @Input() allowAttachments: boolean = true;
  @Input() allowEmojis: boolean = true;

  @Output() messageTextChange = new EventEmitter<string>();
  @Output() messageSent = new EventEmitter<string>();
  @Output() fileAttached = new EventEmitter<File>();
  @Output() emojiSelected = new EventEmitter<string>();
  @Output() typingStarted = new EventEmitter<void>();
  @Output() typingStopped = new EventEmitter<void>();

  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  isTyping = false;
  typingTimeout: any;
  showEmojiPicker = false;

  // Emojis frecuentes
  frequentEmojis = ['😀', '😂', '❤️', '👍', '👎', '😮', '😢', '😡', '🎉', '🔥'];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  onMessageTextChange(value: string): void {
    this.messageText = value;
    this.messageTextChange.emit(value);
    this.handleTypingIndicator();
  }

  private handleTypingIndicator(): void {
    if (!this.isTyping && this.messageText.trim()) {
      this.isTyping = true;
      this.typingStarted.emit();
    }

    // Limpiar timeout anterior
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Nuevo timeout para parar el indicador de escritura
    this.typingTimeout = setTimeout(() => {
      if (this.isTyping) {
        this.isTyping = false;
        this.typingStopped.emit();
      }
    }, 1000);
  }

  sendMessage(): void {
    if (!this.canSendMessage()) return;

    const trimmedMessage = this.messageText.trim();
    this.messageSent.emit(trimmedMessage);
    this.clearInput();

    // Parar indicador de escritura
    if (this.isTyping) {
      this.isTyping = false;
      this.typingStopped.emit();
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Mensaje enviado',
      life: 2000
    });
  }

  canSendMessage(): boolean {
    return !this.disabled &&
           this.messageText.trim().length > 0 &&
           this.messageText.length <= this.maxLength;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'Escape') {
      this.clearInput();
    }
  }

  focusInput(): void {
    setTimeout(() => {
      this.messageInput?.nativeElement?.focus();
    }, 100);
  }

  clearInput(): void {
    this.messageText = '';
    this.messageTextChange.emit('');
    this.focusInput();
  }

  // Manejo de archivos
  openFileDialog(): void {
    if (!this.allowAttachments) return;
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.validateFile(file)) {
        this.fileAttached.emit(file);
        this.messageService.add({
          severity: 'info',
          summary: 'Archivo seleccionado',
          detail: `${file.name} listo para enviar`
        });
      }
    }
    // Limpiar input
    event.target.value = '';
  }

  private validateFile(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo muy grande',
        detail: 'El archivo no puede ser mayor a 10MB'
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Tipo de archivo no válido',
        detail: 'Solo se permiten imágenes, PDFs y documentos de texto'
      });
      return false;
    }

    return true;
  }

  // Manejo de emojis
  toggleEmojiPicker(): void {
    if (!this.allowEmojis) return;
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  selectEmoji(emoji: string): void {
    this.messageText += emoji;
    this.messageTextChange.emit(this.messageText);
    this.emojiSelected.emit(emoji);
    this.focusInput();
  }

  closeEmojiPicker(): void {
    this.showEmojiPicker = false;
  }

  // Utilidades
  getRemainingCharacters(): number {
    return this.maxLength - this.messageText.length;
  }

  isNearLimit(): boolean {
    return this.getRemainingCharacters() < 50;
  }

  isOverLimit(): boolean {
    return this.messageText.length > this.maxLength;
  }

  pasteText(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';
    if (this.messageText.length + pastedText.length > this.maxLength) {
      event.preventDefault();
      this.messageService.add({
        severity: 'warn',
        summary: 'Texto muy largo',
        detail: 'El mensaje excedería el límite de caracteres'
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
