import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gym-repository";

import { CheckInUseCase } from "../check-in";

export function makeCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository();
  const gymRepository = new PrismaGymsRepository();

  const useCase = new CheckInUseCase(checkInsRepository, gymRepository);

  return useCase;
}
