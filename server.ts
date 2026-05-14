import express from "express";
import path from "path";
import cors from "cors";
import https from "https";
import youtubedl from "youtube-dl-exec";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(
    cors({
      origin: "*",
    })
  );

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
      const options: any = {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
      };

      if (process.env.NODE_ENV === "production") {
        options.cookies = path.join(process.cwd(), "cookies.txt");
      }

      const info: any = await youtubedl(url, options);

      // Direct playable URL
      let videoUrl = info.url;

      // fallback from formats
      if (!videoUrl && info.formats?.length) {
        const bestFormat = info.formats
          .filter(
            (f: any) =>
              f.url &&
              f.vcodec !== "none" &&
              f.acodec !== "none"
          )
          .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))[0];

        videoUrl = bestFormat?.url;
      }

      if (!videoUrl) {
        return res.json({
          success: false,
          error: "No video found",
        });
      }

      res.json({
        success: true,
        video: videoUrl,
      });

    } catch (error: any) {
      console.log("DOWNLOAD ERROR:", error);

      res.json({
        success: false,
        error: error.message || "Failed To Fetch Video",
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
        res.setHeader("Content-Type", "video/mp4");
        videoRes.pipe(res);
      })
      .on("error", () => {
        res.send("Download Failed");
      });
  });

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
