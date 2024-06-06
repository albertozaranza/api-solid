import { CheckIn } from "@prisma/client";

import { ResourceNotFoundError } from "./errors/resource-not-found";
import { CheckInsRepository } from "../repositories/check-ins-repository";

interface FetchUseCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUseCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUseCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUseCheckInsHistoryUseCaseRequest): Promise<FetchUseCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    if (!checkIns) {
      throw new ResourceNotFoundError();
    }

    return { checkIns };
  }
}
