import axios from "axios";

export default async function handler(req, res) {
  const url =
    "https://api.geckoterminal.com" + req.url.replace("/api/proxy", "");

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json;version=20230302",
      },
    });

    // Set cache-control header to prevent browser caching
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from GeckoTerminal API:", error); // Agrega esta línea
    res
      .status(500)
      .json({ error: "Error fetching data from GeckoTerminal API" });
  }
}
