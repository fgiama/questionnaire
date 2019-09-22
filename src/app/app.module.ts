import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { QuestionListComponent } from './questionnaire/question-list/question-list.component';
import { QuestionComponent } from './questionnaire/question/question.component';
import { PageNotFoundComponent } from './questionnaire/page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, DialogService, MessageService } from 'primeng/api';
import { QuestionService } from './services/question.service';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { OrderModule } from 'ngx-order-pipe';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
    QuestionListComponent,
    QuestionComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ConfirmDialogModule,
    CommonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    CardModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    OrderModule,
    AngularFontAwesomeModule,
    NgxPaginationModule
  ],
  providers: [ConfirmationService, QuestionService, DialogService, MessageService],
  bootstrap: [AppComponent], 
})
export class AppModule { }
