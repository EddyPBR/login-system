import mongoose from "mongoose";

describe("Import", () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error("MongoDB server not initialized");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should to be a simple sum", () => {
    const x = 2;
    const y = 2;
    return expect(x + y).toBe(4);
  });
});
