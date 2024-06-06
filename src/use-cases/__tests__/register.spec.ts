import { expect, describe, it, beforeEach } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { RegisterUseCase } from "../register";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("register use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register a new user", async () => {
    const { user } = await sut.execute({
      name: "teste",
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "teste",
      email: "teste@teste.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not be able to register user twice", async () => {
    await sut.execute({
      name: "teste",
      email: "teste@teste.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "teste",
        email: "teste@teste.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
