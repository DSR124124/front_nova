import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { EmojiSelectorComponent } from './components/emoji-selector/emoji-selector.component';


@NgModule({
  declarations: [
    ChatWindowComponent,
    MessageListComponent,
    MessageInputComponent,
    EmojiSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
