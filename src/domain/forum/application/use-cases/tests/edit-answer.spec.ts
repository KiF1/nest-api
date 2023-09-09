import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';
import { makeAnswer } from 'tests/factories/make-answer';
import { EditAnswerUseCase } from '../cases/edit-answer';
import { UniqueEntityID } from '@/cors/entities/unique-entity-id';
import { makeAnswerAttachment } from 'tests/factories/make-answer-attachment';
import { InMemoryAnswerAttachmentRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { NotAllowedError } from '@/cors/errors/not-allowed-error';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswersAttachmentsRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'));
    await inMemoryAnswersRepository.create(newAnswer);
    inMemoryAnswersAttachmentsRepository.items.push(
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
      answerId: newAnswer.id.toValue() ,
      content: 'Conteudo teste',
      attachmentsIds: ['1', '3']
    })
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conteudo teste',
    })
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') })
    ])
  })
  it('should be not able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'));
    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({ 
      authorId: 'author-2',
      answerId: newAnswer.id.toValue() ,
      content: 'Conteudo teste',
      attachmentsIds: []
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

