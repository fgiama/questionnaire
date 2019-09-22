import { Answer } from './answer';

export class Question {
    id: string;
    prompt: string;
    order: number;
    answers: Answer[];
    answerCount: number;
}
