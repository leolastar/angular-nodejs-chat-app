const { io: Client } = require("socket.io-client");
const { startServer } = require("../../src/app"); // helper that returns http & io
const redis = require("../../src/config").redisClient;

describe("Socket.io", () => {
  let server, io, client;

  beforeAll(async () => {
    const { httpServer, ioServer } = await startServer();
    io = ioServer;
    server = httpServer;
    client = new Client("http://localhost:4000", {
      auth: { token: "<valid JWT>" },
    });
  });

  afterAll(async () => {
    client.close();
    server.close();
    await redis.flushAll();
  });

  test("receives history on join", (done) => {
    client.emit("join", { convoId: 1 });

    client.on("history", (msgs) => {
      expect(Array.isArray(msgs)).toBeTruthy();
      done();
    });
  });
});
