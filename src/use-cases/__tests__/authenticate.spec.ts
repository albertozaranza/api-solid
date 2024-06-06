import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "../authenticate";
import { InvalidCredentialError } from "../errors/invalid-credential-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("authenticate use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate user", async () => {
    await usersRepository.create({
      name: "teste",
      email: "teste@teste.com",
      password_hash: await hash("123456", 1),
    });

    const { user } = await sut.execute({
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: "teste1@teste.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "teste",
      email: "teste@teste.com",
      password_hash: await hash("123456", 1),
    });

    await expect(() =>
      sut.execute({
        email: "teste@teste.com",
        password: "12345678",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });
});
