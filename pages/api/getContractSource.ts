import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { join } from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const sourceCode = await fs.readFile(
        join(process.cwd(), "constant", "FlattenedSimpleToken.sol"),
        "utf8"
      );
      res.status(200).json({ sourceCode });
    } catch (error) {
      res.status(500).json({ error: "Failed to read contract source" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
