import { expect, describe, it, beforeEach } from "vitest";

import { FetchUseCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUseCheckInsHistoryUseCase;

describe("fetch user check ins history use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUseCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch user history", async () => {
    await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-id-1",
    });

    await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-id-2",
    });

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id-1" }),
      expect.objectContaining({ gym_id: "gym-id-2" }),
    ]);
  });

  it("should be able to fetch paginated check in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: "user-id",
        gym_id: `gym-id-${i}`,
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id-21" }),
      expect.objectContaining({ gym_id: "gym-id-22" }),
    ]);
  });
});
