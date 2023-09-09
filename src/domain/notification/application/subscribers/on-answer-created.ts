import { DomainEvents } from "@/cors/events/domain-events";
import { EventHandler } from "@/cors/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/question-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprises/events/answer-created-event";
import { SendNotificationUseCase } from "../use-cases/cases/send-notification";

export class OnAnswerCreated implements EventHandler{
  constructor(private questionRepository: QuestionsRepository, private sendNotification:  SendNotificationUseCase){
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
      DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name)
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent){
    const question = await this.questionRepository.findById(answer.questionId.toString())
    if(question){
      await this.sendNotification.execute({ 
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: question.excerpt
      })
    }
  }
}