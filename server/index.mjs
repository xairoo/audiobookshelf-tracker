import got from "got";
import { config, db, logger } from "./lib/index.mjs";
import { insertMedia } from "./lib/media.mjs";
import { initializeSocket } from "./lib/socket.io-client.mjs";

const podcastTitles = [];
const allSessions = [];

async function checkApi() {
  try {
    await got(config.ABS_URL);
    logger.info(`(ABS) API online`);
    return true;
  } catch (error) {
    logger.error(`(ABS) API offline`);
    return false;
  }
}

async function waitForApi() {
  if (await checkApi()) {
    return true;
  } else {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return waitForApi();
}

// Get all sessions in case we missed something
async function fetchAllSessions() {
  const itemsPerPage = 100;

  try {
    for await (const pageData of got.paginate(
      `${config.ABS_URL}/api/sessions`,
      {
        searchParams: {
          itemsPerPage: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${config.ABS_TOKEN}`,
        },
        responseType: "json",
        pagination: {
          transform: ({ body }) => {
            try {
              if (Array.isArray(body.sessions)) {
                const sessions = body.sessions.map((session) => {
                  const progress =
                    (session.currentTime * 100) / session.duration / 100;

                  return {
                    id: session.id,
                    libraryItemId: session.libraryItemId,
                    episodeId: session.episodeId,
                    type: session.mediaType,
                    displayTitle: session.displayTitle,
                    displayAuthor: session.displayAuthor,
                    duration: session.duration,
                    currentTime: session.currentTime,
                    startedAt: session.startedAt,
                    updatedAt: session.updatedAt,
                    userId: session.user.id,
                    progress: progress >= 1 ? 1 : progress,
                  };
                });

                return [sessions];
              } else {
                return [];
              }
            } catch (err) {
              logger.error("Transform failed:", err);
              return [];
            }
          },
          paginate: ({ response, currentItems }) => {
            // If there is no more data, finish.
            if (currentItems.length === 0) {
              return false;
            }

            try {
              const body = response.body;

              if (body?.page + 1 >= body?.numPages) {
                return false;
              }

              return {
                searchParams: {
                  itemsPerPage: itemsPerPage,
                  page: body.page + 1,
                },
              };
            } catch (err) {
              logger.error("Paginate failed:", err);
              return false;
            }
          },
        },
      }
    )) {
      if (Array.isArray(pageData)) {
        allSessions.push(...pageData);
      }
    }

    return allSessions;
  } catch (err) {
    logger.error("Paginate failed:", err.message);
    throw err;
  }
}

// Get all users
async function getUsers() {
  try {
    const { users } = await got
      .get(new URL("api/users", config.ABS_URL), {
        headers: {
          Authorization: `Bearer ${config.ABS_TOKEN}`,
        },
      })
      .json();

    // Insert or update users
    for (const user of users) {
      try {
        const id = await new Promise((resolve, reject) => {
          db.run(
            `INSERT OR REPLACE INTO users (id, username) VALUES (?,?)`,
            [user.id, user.username],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      } catch (err) {
        logger.error(err);
      }
    }
    logger.info("Insert or update users done");
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  // ABS API online?
  await waitForApi();

  // Get all users
  await getUsers();

  // Get all sessions
  const sessions = await fetchAllSessions();

  for (const session of sessions) {
    let title;
    let author;

    // Books
    if (session.type === "book") {
      author = session.displayAuthor;
      title = session.displayTitle;
    }

    // Podcasts
    if (session.type === "podcast") {
      let podcastTitle = podcastTitles.find((entry) => {
        return entry.libraryItemId === session.libraryItemId;
      })?.podcastTitle;

      if (podcastTitle) {
        author = podcastTitle;
      } else {
        const res = await got.get(
          new URL(`api/items/${session.libraryItemId}`, config.ABS_URL),
          {
            headers: {
              Authorization: `Bearer ${config.ABS_TOKEN}`,
            },
            responseType: "json",
            throwHttpErrors: false,
          }
        );

        if (res.statusCode === 200) {
          author = res.body?.media?.metadata?.title;

          podcastTitles.push({
            libraryItemId: session.libraryItemId,
            podcastTitle: author,
          });
        }
      }

      title = session.displayTitle;
    }

    await insertMedia({
      id: session?.libraryItemId,
      userId: session?.userId,
      updatedAt: session?.updatedAt,
      type: session?.type,
      libraryItemId: session?.libraryItemId,
      episodeId: session?.episodeId,
      progress: session?.progress,
      title: title,
      author: author,
    });
  }
  logger.info("Fetch all sessions done");

  try {
    const { users } = await got
      .get(new URL("api/users", config.ABS_URL), {
        headers: {
          Authorization: `Bearer ${config.ABS_TOKEN}`,
        },
      })
      .json();

    // Insert or update all entries of mediaProgress
    for (const user of users) {
      const userObj = await got
        .get(new URL(`api/users/${user.id}`, config.ABS_URL), {
          headers: {
            Authorization: `Bearer ${config.ABS_TOKEN}`,
          },
        })
        .json();

      for (const media of userObj?.mediaProgress) {
        await insertMedia({
          userId: media?.userId,
          updatedAt: media?.lastUpdate,
          type: media?.mediaItemType,
          libraryItemId: media?.libraryItemId,
          episodeId: media?.episodeId,
          progress: media?.progress,
        });
      }
    }
    logger.info("Insert or update all entries of mediaProgress done");

    // Start the socket connections
    for (const user of users) {
      const success = await initializeSocket({
        userId: user.id,
        username: user.username,
        token: user.token,
      });
      if (!success) {
        logger.error(`(socket) failed to connect (${user.username})`);
      }
    }
  } catch (err) {
    logger.error(err);
  }
})();
