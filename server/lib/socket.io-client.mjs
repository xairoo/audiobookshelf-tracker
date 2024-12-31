import { io } from "socket.io-client";
import { config, logger } from "./index.mjs";
import { insertMedia } from "./media.mjs";

export let socket = null;
let isConnected = false;

export async function initializeSocket({ userId, username, token }) {
  try {
    if (!config.ABS_URL) {
      logger.error(`Missing ENV ABS_URL`);
      return;
    }

    if (!token) {
      logger.error(`Missing token (${username})`);
      return;
    }

    socket = io(config.ABS_URL);
    logger.info(`(socket) (${username}) Initializing`);

    socket.on("connect", () => {
      logger.info(`(socket) (${username}) Connected`);
      isConnected = true;

      if (token) {
        // If disconnected and re-connected we will have a new socket id
        //   so re-auth
        socket.emit("auth", token);
      }
    });

    socket.on("disconnect", () => {
      logger.info(`(socket) (${username}) Disconnected`);
      isConnected = false;
    });

    socket.on("connect_error", (err) => {
      logger.error(`(socket) (${username}) Connection error: ${err.message}`);
      isConnected = false;
    });

    socket.on("init", (data) => {
      // console.log("User was authorized", data);
      // socket.emit("message_all_users", { message: "Hello World" });
    });

    socket.onAny(async (eventName, args) => {
      try {
        // user_updated
        // triggered on:
        // - manually mark as finished/unfinished
        if (eventName === "user_updated") {
          if (Array.isArray(args?.mediaProgress)) {
            args?.mediaProgress.sort((a, b) => a.lastUpdate - b.lastUpdate);

            // Process only the current item
            const media = args?.mediaProgress[args?.mediaProgress.length - 1];

            insertMedia({
              userId: media?.userId,
              updatedAt: media?.lastUpdate,
              type: media?.mediaItemType,
              libraryItemId: media?.libraryItemId,
              episodeId: media?.episodeId,
              progress: media?.progress,
            });
          }
        }

        // user_item_progress_updated
        // triggered on:
        // - automatically while playing
        if (eventName === "user_item_progress_updated") {
          insertMedia({
            userId: args.data?.userId,
            updatedAt: args.data?.lastUpdate,
            type: args.data?.mediaItemType,
            libraryItemId: args.data?.libraryItemId,
            episodeId: args.data?.episodeId,
            progress: args.data?.progress,
          });
        }
      } catch (err) {
        logger.error(err);
      }
    });
  } catch (err) {
    logger.error(err);
  }

  return waitForConnection();
}

async function waitForConnection(waits = 0) {
  if (isConnected) {
    return true;
  }
  if (!isConnected && waits > 10) {
    logger.error("Waited too long");
    return false;
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return waitForConnection(++waits);
}
