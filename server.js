import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { create, all } from "mathjs";

const math = create(all);
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve frontend

app.post("/ask", (req, res) => {
  try {
    const { question } = req.body;
    const result = math.evaluate(question);
    const notes = [
      { type: "simplify", text: `You entered: ${question}` },
      { type: "simplify", text: `Evaluated result: ${result}` },
    ];
    res.json({ result, notes });
  } catch (err) {
    res.status(400).json({ error: "Invalid math expression." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
