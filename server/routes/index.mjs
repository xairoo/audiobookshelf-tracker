import routeAuth from "./v1/auth/index.mjs";
import routeUsers from "./v1/users/index.mjs";
import routeUser from "./v1/user/[userId]/index.mjs";
import routeUserHistory from "./v1/user/[userId]/history.mjs";

function api(server) {
  server.get("/v1", async (req, res) => {
    res.status(200).json({
      version: process.env.npm_package_version,
    });
  });

  server.use("/v1/auth", [routeAuth]);
  server.use("/v1/users", [routeUsers]);
  server.use("/v1/user", [routeUser, routeUserHistory]);

  // Return 404 for all unknown requests
  server.use("*", async (req, res) => {
    res.status(404);
    res.json({ error: "Resource for this request not found" });
  });

  // Return 400 for any other problems
  server.use(function (err, req, res, next) {
    // console.log(err);
    res.status(err.code ? err.code : 400).json({
      error: err.error
        ? err.error
        : "Unknown error, could be a malformed request",
    });
  });
}

export default api;
