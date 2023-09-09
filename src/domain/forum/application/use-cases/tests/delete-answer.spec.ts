import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';
import { makeAnswer } from 'tests/factories/make-answer';
import { DeleteAnswerUseCase } from '../cases/delete-answer';
import { UniqueEntityID } from '@/cors/entities/unique-entity-id';
import { InMemoryAnswerAttachmentRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'tests/factories/make-answer-attachment';
import { NotAllowedError } from '@/cors/errors/not-allowed-error';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'));
    await inMemoryAnswersRepository.create(newAnswer);
    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2')
      })
    )

    await sut.execute({ 
      authorId: 'author-1',
      answerId: 'answer-1' 
    })
    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0)
  })
  it('should be not able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'));
    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({ 
      authorId: 'author-2',
      answerId: 'answer-1' 
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

