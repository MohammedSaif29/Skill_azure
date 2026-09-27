const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { recommendStorage } = require("./recommendation");

const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message: "Azure Storage Tier Analyzer API is running"
    });

});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {

    res.json({
        status: "OK",
        message: "Backend is working"
    });

});


// ==========================================
// STORAGE RECOMMENDATION
// ==========================================

app.post("/api/recommend", (req, res) => {

    try {

        const result = recommendStorage(req.body);

        if (result.error) {

            return res.status(400).json(result);

        }

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to generate recommendation"
        });

    }

});


// ==========================================
// AZURE BENCHMARK RESULTS
// ==========================================

app.get("/api/benchmark", (req, res) => {

    try {

        const filePath = path.join(
            __dirname,
            "benchmark_results.csv"
        );

        const csvData = fs.readFileSync(
            filePath,
            "utf8"
        );

        const lines = csvData.trim().split(/\r?\n/);

        const results = lines.slice(1).map(line => {

            const values = line.split(",");

            return {
                file: values[0],
                size_mb: Number(values[1]),
                download_time_sec: Number(values[2]),
                throughput_mb_s: Number(values[3])
            };

        });

        res.json(results);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load benchmark results"
        });

    }

});


// ==========================================
// START SERVER
// ==========================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});