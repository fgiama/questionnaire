import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent } from './questionnaire/question/question.component';
import { QuestionListComponent } from './questionnaire/question-list/question-list.component';
import { PageNotFoundComponent } from './questionnaire/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'question-list', component: QuestionListComponent },
  { path: 'question/:id',  component: QuestionComponent },
  { path: '',   redirectTo: '/question-list', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
