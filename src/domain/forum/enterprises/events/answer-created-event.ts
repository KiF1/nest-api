import { DomainEvent } from "@/cors/events/domain-event";
import { Answer } from "../entities/answer";
import { UniqueEntityID } from "@/cors/entities/unique-entity-id";

export class AnswerCreatedEvent implements DomainEvent{
  public ocurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer){
    this.answer = answer;
    this.ocurredAt = new Date()
  }
  
  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}