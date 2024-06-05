import { expect, describe, it } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "@/http/repositories/in-memory/in-memory-users-repository";

import { RegisterUseCase } from "../register";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

describe("register use case", () => {
  it("should be able to register a new user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "teste",
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "teste",
      email: "teste@teste.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should be able to register user twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name: "teste",
      email: "teste@teste.com",
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "teste",
        email: "teste@teste.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
