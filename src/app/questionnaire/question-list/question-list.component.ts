import { Component, OnInit } from '@angular/core';
import { Question } from '../../entities/question';
import { QuestionService } from '../../services/question.service';
import { DialogService, ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  questions: Question[];
  questionsToSave: Question[];
  displayDialog: boolean;
  newTitle: string;
  isAddDisabled: boolean;
  isClearEnabled: boolean;
  emptyListMessage: string;
  orderProperty: string;
  p: number = 1;
  totalQuestions: number
  currentQuestionIndex: number = 0;
 
  constructor(private questionService: QuestionService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions()
  {
    this.questionService.getQuestions().subscribe(data => {
      this.questions = data;
      this.questionsToSave = Object.assign([], this.questions); //clone array
      
      if(this.questions)
      {
        this.isAddDisabled = this.questions.length >= 10;
        this.totalQuestions = this.questions.length;
      }
      if(this.questions.length == 0)
      {
        this.emptyListMessage = "No questions added!";
        this.isClearEnabled = false; 
      }
      else 
      {
        this.emptyListMessage = "";
        this.isClearEnabled = true;
      }
      this.orderProperty = 'order';
      var currentPage = localStorage.getItem("currentPage");
      if(currentPage)
      {
        this.p = parseInt(currentPage);
        localStorage.removeItem("currentPage");
      }
      else
      {
        this.p = Math.floor((this.currentQuestionIndex-1)/5) + 1;
      } 
    });
  }

  showDialogToAdd() {
    this.displayDialog = true;
  }

  save() {
    if(!this.newTitle){
      this.messageService.add({severity:'warning', summary: 'Save Message', detail:'Title cannot be empty!'});
      return;
    }
    var newQuestion = new Question();
    newQuestion.prompt = this.newTitle;
    newQuestion.order = this.questions.length + 1;
    newQuestion.answers = [];
    this.questionsToSave.push(newQuestion);
    
    this.saveQuestionnaire(this.addCallbackSuccess, this.callbackFail);
  }

  addCallbackSuccess = () : void => {
    this.displayDialog = false;
    this.newTitle = '';
   
    this.isAddDisabled = this.questions.length == 9;
    if(this.isAddDisabled)
    {
      this.messageService.add({severity:'warning', summary: 'Add disabled', detail:'No more than 10 questions can be added.'});
    }
    
    this.currentQuestionIndex = this.questions.length + 1;
  }

  callbackFail = () : void => {
    this.messageService.add({severity:'error', summary: 'Error Message', detail:'Could not perform action'});
  }
  

  cancel() {
    this.displayDialog = false;
    this.newTitle = '';
  }

  deleteQuestion(question: Question) 
  {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
          var index = this.questionsToSave.indexOf(question);
          this.currentQuestionIndex = question.order;

          this.questionsToSave.splice(index, 1);
      
          this.questionsToSave.forEach(element => {
            if(element.order > question.order)
              element.order--;
          });
          this.saveQuestionnaire(() : void => {}, this.callbackFail);
      }
    });
  }

  editQuestion(question: Question)
  {
    localStorage.setItem("currentPage", this.p.toString());
    localStorage.setItem("totalQuestions", this.questions.length.toString());
    this.router.navigate(['/question', question.id]);
  }

  reorderUp(question:Question)
  {
    var previous = this.questionsToSave.find(x=>x.order == question.order-1);
    previous.order++;
    question.order--;
    this.currentQuestionIndex = question.order;
    this.saveQuestionnaire(() : void => {}, this.reorderUpCallbackFail);
  }

  reorderUpCallbackFail = () : void => {
    this.currentQuestionIndex--;
  }

  reorderDown(question:Question)
  {
    var next = this.questionsToSave.find(x=>x.order == question.order+1);
    next.order--;
    question.order++;
    this.currentQuestionIndex = question.order;
    this.saveQuestionnaire(() : void => {}, this.reorderDownCallbackFail);
  }

  reorderDownCallbackFail = () : void => {
    this.currentQuestionIndex++;
  }

  isFirst(order: number): boolean
  {
    return order == 1;
  }

  isLast(order: number)
  {
    return order == this.questions.length;
  }

  clearAll()
  {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
       
        this.questionsToSave = [];
        this.saveQuestionnaire(() : void => {}, this.callbackFail);
      }
    });
  }

  saveQuestionnaire(callbackSuccess:() => any, callbackFail:() => any): void
  {
    this.questionService.addQuestionnaire(this.questionsToSave).subscribe(data => {
      if(!data.isSuccess)
      {
        callbackFail();
      }
      else{
        callbackSuccess();
      }
      
      console.log(data.message);
      
      this.loadQuestions();
    },
    err => {
      callbackFail();
      console.log(err.message);
      this.loadQuestions();
    });
  }

  onPageChange(event)
  {
    this.p = event;
  }
}
