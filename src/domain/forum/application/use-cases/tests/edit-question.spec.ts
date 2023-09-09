import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';
import { makeQuestion } from 'tests/factories/make-question';
import { EditQuestionUseCase } from '../cases/edit-question';
import { UniqueEntityID } from '@/cors/entities/unique-entity-id';
import { InMemoryQuestionAttachmentRepository } from 'tests/repositories/in-memory-questions-attachments-repository';
import { makeQuestionAttachment } from 'tests/factories/make-question-attachment';
import { NotAllowedError } from '@/cors/errors/not-allowed-error';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository)
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionsAttachmentsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('question-1'));
    await inMemoryQuestionsRepository.create(newQuestion);
    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2')
      })
    )

    await sut.execute({ 
      authorId: 'author-1',
      questionId: newQuestion.id.toValue() ,
      title: 'Pergunta Teste',
      content: 'Conteudo teste',
       attachmentsIds: ['1', '3']
    })
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Pergunta Teste',
      content: 'Conteudo teste',
    })
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') })
    ])
  })
  it('should be not able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('question-1'));
    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({ 
      authorId: 'author-2',
      questionId: newQuestion.id.toValue() ,
      title: 'Pergunta Teste',
      content: 'Conteudo teste',
      attachmentsIds: []
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

