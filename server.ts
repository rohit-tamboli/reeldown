import express from "express";
import path from "path";
import cors from "cors";
import https from "https";
import youtubedl from "youtube-dl-exec";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Download endpoint - wraps youtube-dl-exec instead of python shell
  app.get("/api/download", async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
    return res.json({
      success: false,
      error: "URL Required",
    });
  }

  try {
    const rawOutput = await youtubedl(url, {
      format: "best",
      getUrl: true,
    });

    const videoUrl =
      typeof rawOutput === "string"
        ? rawOutput.split("\n")[0].trim()
        : "";

    if (!videoUrl) {
      throw new Error("No Video URL");
    }

    res.json({
      success: true,
      video: videoUrl,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      error: "Failed To Fetch Video",
    });
  }
});

  // Proxy the download file for saving as MP4 (so users can easily download to disk)
  app.get("/api/download-file", async (req, res) => {
    const fileUrl = req.query.url as string;

    if (!fileUrl) {
      return res.send("No URL");
    }

    https
      .get(fileUrl, (videoRes) => {
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=instadown-reel.mp4"
        );
        res.setHeader("Content-Type", "application/octet-stream");
        videoRes.pipe(res);
      })
      .on("error", () => {
        res.send("Download Failed");
      });
  });

//   app.get("/", (req, res) => {
//   res.send("ReelDown Backend Running");
// });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Vite middleware setup for Full-Stack React
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { server }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

startServer();
