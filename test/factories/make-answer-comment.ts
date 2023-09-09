import { UniqueEntityID } from "@/cors/entities/unique-entity-id";
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprises/entities/answer-comment";
import { faker } from '@faker-js/faker'

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityID){
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override
    }, 
    id
  )
  return answerComment
}