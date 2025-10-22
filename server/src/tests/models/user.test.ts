import User from "../../models/user";
import { test, expect } from "mocha";

test("creates a user", async () => {
  const u: any = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "hashed",
  });
  expect(u.id).toBeDefined();
});
