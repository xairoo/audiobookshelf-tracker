import { Server } from "socket.io";
import { config, server, logger } from "./index.mjs";

// Start socket.io server
export const io = new Server(server, {
  cors: {
    origin: `http://localhost:${config.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  logger.info("socket.io: user connected");

  // io.local.emit("msg", JSON.stringify({ activity: "idle" }));

  socket.on("msg", (msg) => {
    try {
      const data = JSON.parse(msg);
      console.log(data);
    } catch (err) {
      //
    }
  });
});
