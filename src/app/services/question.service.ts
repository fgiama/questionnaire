import { Injectable } from '@angular/core';
import { Question } from '../entities/question';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../entities/answer';
import { catchError, map, tap} from 'rxjs/operators';
import { ResponseItem } from '../entities/response-item';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiBaseUrl = 'http://localhost:5000/api/'
  private apiQuestionsUrl = this.apiBaseUrl + 'questions';
  private apiAddQuestionnaireUrl = this.apiBaseUrl + 'questionnaire';
  private apiUpdateQuestionUrl = this.apiQuestionsUrl + '/';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {

    console.log(error);
    return throwError(error);
  }
  
  getQuestions(): Observable<Question[]>
  {
    return this.http.get<Question[]>(this.apiQuestionsUrl).pipe(
      map(data => this.transformDataToQuestionList(data)),
      catchError(this.handleError)
    );
  }

  getQuestion(id): Observable<Question>
  {
    return this.http.get<Question[]>(this.apiQuestionsUrl).pipe(
      map(data => this.findAndTransformDataToQuestion(data, id)),
      catchError(this.handleError)
    );
  }

  getNextQuestion(id): Observable<Question>
  {
    return this.http.get<Question[]>(this.apiQuestionsUrl).pipe(
      map(data => this.findAndTransformDataToNextQuestion(data, id)),
      catchError(this.handleError)
    );
  }

  getPreviousQuestion(id): Observable<Question>
  {
    return this.http.get<Question[]>(this.apiQuestionsUrl).pipe(
      map(data => this.findAndTransformDataToPreviousQuestion(data, id)),
      catchError(this.handleError)
    );
  }

  
  addQuestionnaire(questions: Question[]): Observable<ResponseItem>
  {
    var response = new ResponseItem();

    return this.http.post<ResponseItem>(this.apiAddQuestionnaireUrl, questions).pipe(
      map(data => {
        response.isSuccess = data["success"];
        response.message = response.isSuccess ? data["message"]: data["error"];
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateQuestion(question: Question): Observable<ResponseItem>
  {
    var response = new ResponseItem();
    return this.http.put<Question>(this.apiUpdateQuestionUrl + question.id, question).pipe(
      map(data => {
        response.isSuccess = data["success"];
        response.message = response.isSuccess ? data["message"]: data["error"];
        return response;
      }),
      catchError(this.handleError)
    );
  }

  transformDataToQuestionList(data: any): Question[] {
    var list: Question[] = [];

    if(data["success"] == true) {

      data["data"].forEach(q => {
        var question = this.createQuestion(q);
        list.push(question);
      });
    }
    return list;
  }

  transformDataToQuestion(data: any): Question {
    var question: Question;
    if(data["success"] == true) {
      var q = data["data"];
      question = this.createQuestion(q);
    }
    return question;
  }

  createQuestion(q: any): Question
  {
    var question = new Question();
    question.prompt = q["prompt"];
    question.id = q["id"];
    question.order = q["order"];
    question.answerCount = 0;
    question.answers = [];
    if(q["answers"]) {
      q["answers"].forEach(a => { 
        var answer = new Answer();
        answer.order = a["order"];
        answer.body = a["body"];
        question.answers.push(answer);
        question.answerCount++;
      });
    }

    return question;
  }

  findAndTransformDataToQuestion(data:any, id:string): Question {
    var list = this.transformDataToQuestionList(data);

    return list.find(x=> x.id == id);
  }

  findAndTransformDataToNextQuestion(data:any, id:string): Question {
    var list = this.transformDataToQuestionList(data);
    var current = list.find(x=> x.id == id);

    var next = list.find(x=> x.order == current.order + 1);
    return next;
  }

  findAndTransformDataToPreviousQuestion(data:any, id:string): Question {
    var list = this.transformDataToQuestionList(data);
    var current = list.find(x=> x.id == id);
    var previous = list.find(x=> x.order == current.order - 1);
    return previous;
  }
}


