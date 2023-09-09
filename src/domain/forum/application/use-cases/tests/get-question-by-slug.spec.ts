import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from '../cases/get-question-by-slug';
import { makeQuestion } from 'tests/factories/make-question';
import { Slug } from '@/domain/forum/enterprises/entities/value-objects/slug';
import { InMemoryQuestionAttachmentRepository } from 'tests/repositories/in-memory-questions-attachments-repository';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: 'example-question'
    })
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title
      })
    })
    })
})

