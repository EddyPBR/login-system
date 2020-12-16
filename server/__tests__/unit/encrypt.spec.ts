import bcrypt from "bcryptjs";

describe("Encryptation", () => {
  const password = "1234";

  it("should to create a new encrypted password", () => {
    const encryptedPassword = bcrypt.hashSync(password, 8);
    expect(encryptedPassword).toHaveLength(60);
  });
});
