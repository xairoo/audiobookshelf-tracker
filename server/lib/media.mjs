import got from "got";
import { logger, db } from "./index.mjs";

const podcastAuthors = [];

async function getItem(libraryItemId) {
  const res = await got.get(
    new URL(`api/items/${libraryItemId}`, process.env.ABS_URL),
    {
      headers: {
        Authorization: `Bearer ${process.env.ABS_TOKEN}`,
      },
      responseType: "json",
      throwHttpErrors: false,
    }
  );

  if (res.statusCode === 200) {
    if (res.body?.media?.metadata?.subtitle) {
      return res.body?.media?.metadata?.subtitle;
    }
    return null;
  } else {
    return null;
  }
}

export function insertMedia({
  userId,
  lastUpdate,
  type,
  libraryItemId,
  episodeId,
  progress,
  title,
  author,
}) {
  return new Promise(async (resolve, reject) => {
    (async () => {
      let url;
      let podcastId;

      const subtitle = await getItem(libraryItemId);

      if (type === "podcastEpisode" || type === "podcast") {
        if (!author) {
          url = `api/podcasts/${libraryItemId}/episode/${episodeId}`;

          author = podcastAuthors.find((entry) => {
            return entry.libraryItemId === libraryItemId;
          })?.author;

          if (!author) {
            const res = await got.get(
              new URL(`api/items/${libraryItemId}`, process.env.ABS_URL),
              {
                headers: {
                  Authorization: `Bearer ${process.env.ABS_TOKEN}`,
                },
                responseType: "json",
                throwHttpErrors: false,
              }
            );

            if (res.statusCode === 200 && res.body?.media?.metadata?.title) {
              author = res.body.media.metadata.title;

              podcastAuthors.push({
                libraryItemId,
                author,
              });
            }
          }
        }
      } else {
        url = `api/items/${libraryItemId}`;
      }

      try {
        if (!title || !author) {
          //
          const res = await got.get(new URL(url, process.env.ABS_URL), {
            headers: {
              Authorization: `Bearer ${process.env.ABS_TOKEN}`,
            },
            responseType: "json",
            throwHttpErrors: false,
          });

          if (res.statusCode !== 200) {
            return resolve();
          }

          if (!title) {
            title = res.body.title;
          }

          if (!author) {
            author = res.body.author;
          }

          podcastId = res.body.podcastId;

          if (res?.body?.media?.metadata) {
            title = res.body.media.metadata.title;
            author = res.body.media.metadata.authors
              .map((author) => {
                return author.name;
              })
              .join(", ");
          }
        }

        let query = `SELECT * FROM items WHERE userId = ? AND itemId = ?`;
        const params = [userId, libraryItemId];
        let queryUpdate = `UPDATE items SET author = ?, title = ?, subtitle = ?, progress = ?, updatedAt = ? WHERE userId = ? AND itemId = ?`;
        const paramsUpdate = [
          author ? author : null,
          title ? title : null,
          subtitle ? subtitle : null,
          progress ? progress : null,
          new Date().toISOString(), // Use the current date and not the one from audiobookshelf
          userId,
          libraryItemId, //res.body.id,
        ];

        // Add episodeId condition dynamically
        if (episodeId !== undefined && episodeId !== null) {
          query += " AND episodeId = ?";
          queryUpdate += " AND episodeId = ?";
          params.push(episodeId);
          paramsUpdate.push(episodeId);
        } else {
          query += " AND episodeId IS NULL";
        }

        query += ` LIMIT 1`;

        logger.info(`(media) ${author} - ${title}`);

        // Get current item from db
        await new Promise(async (resolve, reject) => {
          db.get(query, params, (err, row) => {
            if (row) {
              // Update
              db.run(queryUpdate, paramsUpdate);
            } else {
              // Insert new item
              db.run(
                `INSERT INTO items (userId, itemId, episodeId, type, author, title, subtitle,progress, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  userId,
                  libraryItemId,
                  episodeId,
                  type,
                  author,
                  title,
                  subtitle,
                  progress,
                  new Date().toISOString(), // Use the current date and not the one from audiobookshelf
                ],
                function (err) {
                  if (err) {
                    logger.error(err);
                  }
                }
              );
            }
            resolve();
          });
        });
      } catch (err) {
        logger.error(err);
      }
      resolve();
    })();
  });
}
