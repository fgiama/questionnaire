import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/entities/question';
import { Answer } from 'src/app/entities/answer';
import { QuestionService } from 'src/app/services/question.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  private question: Question;
  private newAnswerText: string;
  id: string;
  order: number;
  orderProperty = 'order';

  constructor(private questionService: QuestionService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.loadQuestion(this.id);
  }

  loadQuestion(id)
  {
    this.question = new Question();
    this.question.answers = [];
    this.questionService.getQuestion(id).subscribe(data => {
      this.question= data;
      this.order = this.question.order;
    });
  }

  addToAnswersAndSave(newAnswerText: string)
  {
    if(!newAnswerText) return;

    var newAswer = new Answer();
    newAswer.order = this.question.answers.length + 1;
    newAswer.body = newAnswerText;
    this.question.answers.push(newAswer);

    this.saveQuestion();
  }

  addAnswerAndSave()
  {
    if(this.newAnswerText)
    {
      this.addToAnswersAndSave(this.newAnswerText);
    }
    else{
      this.saveQuestion();
    }
  }

  deleteAnswer(answer: Answer)
  {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
       
          var index = this.question.answers.indexOf(answer);
          this.question.answers.splice(index, 1);

          this.question.answers.forEach(element => {
            if(element.order > answer.order)
              element.order--;
          });

          this.saveQuestion();
      }
    });
  }

  reorderUp(answer:Answer)
  {
    var previous = this.question.answers.find(x=>x.order == answer.order-1);
    previous.order++;
    answer.order--;
    
    this.saveQuestion();
  }

  reorderDown(answer:Answer)
  {
    var next = this.question.answers.find(x=>x.order == answer.order+1);
    next.order--;
    answer.order++;
    this.saveQuestion();
  }

  isFirst(order: number): boolean
  {
    return order == 1;
  }

  isLast(order: number)
  {
    return order == this.question.answers.length;
  }

  saveQuestion()
  {
    this.questionService.updateQuestion(this.question).subscribe(data => {
      if(!data.isSuccess)
        this.messageService.add({severity:'error', summary: 'Error Message', detail:'Action not performed.'});
        else {
          this.newAnswerText = '';
        }
      console.log(data.message);
      this.loadQuestion(this.id);
    },
    err => {
      this.messageService.add({severity:'error', summary: 'Error Message', detail:'Could not perform action.'});
      console.log(err.message);
      this.loadQuestion(this.id);
    });
  }
  

  isFirstQuestion(): boolean
  {
    return this.question.order == 1;
  }

  isLastQuestion(): boolean
  {
    return this.question.order == parseInt(localStorage.getItem("totalQuestions"));
  }

  moveToPrevious() 
  {
    this.questionService.getPreviousQuestion(this.id).subscribe(data => {
      this.id = data.id;
      this.loadQuestion(data.id);
      
      localStorage.setItem("currentPage", "1");
      this.router.navigate(['/question', data.id]);
    });
  }

  moveToNext() 
  {
    this.questionService.getNextQuestion(this.id).subscribe(data => {
      this.id = data.id;
      this.loadQuestion(data.id);
      
      localStorage.setItem("currentPage", "1");
      this.router.navigate(['/question', data.id]);
    });
  }
}
