import { UseCaseError } from "@/cors/errors/use-case-error";

export class NotAllowedError extends Error implements UseCaseError{
  constructor(){
    super('Not allowed')
  }
}