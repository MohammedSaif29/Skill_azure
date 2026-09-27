import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./App.css";


function App() {

  // ==========================================
  // WORKLOAD FORM
  // ==========================================

  const [form, setForm] = useState({
    workloadType: "real_time_application",
    requestsPerSecond: 1000,
    readPercentage: 80,
    writePercentage: 20,
    latencyRequirement: "low",
    accessFrequency: "very_high",
    costSensitivity: "medium"
  });


  // ==========================================
  // RECOMMENDATION STATE
  // ==========================================

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  // ==========================================
  // BENCHMARK STATE
  // ==========================================

  const [benchmarkResults, setBenchmarkResults] = useState([]);
  const [benchmarkLoading, setBenchmarkLoading] = useState(true);


  // ==========================================
  // LOAD AZURE BENCHMARK RESULTS
  // ==========================================

  useEffect(() => {

    const loadBenchmarkResults = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/benchmark"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch benchmark data"
          );
        }

        const data = await response.json();

        setBenchmarkResults(data);

      } catch (error) {

        console.error(
          "Failed to load benchmark results:",
          error
        );

      } finally {

        setBenchmarkLoading(false);

      }

    };

    loadBenchmarkResults();

  }, []);


  // ==========================================
  // HANDLE FORM CHANGES
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };


  // ==========================================
  // ANALYZE WORKLOAD
  // ==========================================

  const analyzeWorkload = async () => {

    setLoading(true);
    setResult(null);

    try {

      const response = await fetch(
        "http://localhost:5000/api/recommend",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            ...form,

            requestsPerSecond:
              Number(form.requestsPerSecond),

            readPercentage:
              Number(form.readPercentage),

            writePercentage:
              Number(form.writePercentage)

          })
        }
      );


      if (!response.ok) {

        throw new Error(
          "Recommendation request failed"
        );

      }


      const data = await response.json();

      setResult(data);

    } catch (error) {

      console.error(error);

      setResult({

        error:
          "Unable to connect to backend. Make sure the Node.js server is running."

      });

    }

    setLoading(false);

  };


  // ==========================================
  // CALCULATE PERFORMANCE SUMMARY
  // ==========================================

  const averageThroughput =
    benchmarkResults.length > 0
      ? (
          benchmarkResults.reduce(
            (sum, item) =>
              sum + Number(item.throughput_mb_s),
            0
          ) / benchmarkResults.length
        ).toFixed(2)
      : "0.00";


  const largestFile =
    benchmarkResults.length > 0
      ? Math.max(
          ...benchmarkResults.map(
            item => Number(item.size_mb)
          )
        )
      : 0;


  const totalData =
    benchmarkResults.length > 0
      ? benchmarkResults
          .reduce(
            (sum, item) =>
              sum + Number(item.size_mb),
            0
          )
          .toFixed(0)
      : 0;


  const fastestDownload =
    benchmarkResults.length > 0
      ? Math.min(
          ...benchmarkResults.map(
            item =>
              Number(item.download_time_sec)
          )
        ).toFixed(2)
      : "0.00";


  const slowestDownload =
    benchmarkResults.length > 0
      ? Math.max(
          ...benchmarkResults.map(
            item =>
              Number(item.download_time_sec)
          )
        ).toFixed(2)
      : "0.00";


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app">


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="header">

        <div>

          <h1>
            Azure Storage Analyzer
          </h1>

          <p>
            Intelligent performance tier selection
            for Azure workloads
          </p>

        </div>

      </header>


      <main className="container">


        {/* ====================================
            WORKLOAD FORM
        ==================================== */}

        <section className="card">

          <h2>
            Analyze Your Workload
          </h2>


          <p className="subtitle">

            Enter your workload characteristics
            to determine the appropriate Azure
            storage performance option.

          </p>


          <div className="form-grid">


            {/* WORKLOAD TYPE */}

            <div className="field">

              <label>
                Workload Type
              </label>

              <select
                name="workloadType"
                value={form.workloadType}
                onChange={handleChange}
              >

                <option value="real_time_application">
                  Real-time Application
                </option>

                <option value="transaction_processing">
                  Transaction Processing
                </option>

                <option value="high_performance_computing">
                  High Performance Computing
                </option>

                <option value="web_application">
                  Web Application
                </option>

                <option value="document_storage">
                  Document Storage
                </option>

                <option value="backup">
                  Backup
                </option>

                <option value="archive">
                  Archive
                </option>

              </select>

            </div>


            {/* REQUESTS PER SECOND */}

            <div className="field">

              <label>
                Requests per Second
              </label>

              <input
                type="number"
                name="requestsPerSecond"
                value={form.requestsPerSecond}
                onChange={handleChange}
                min="1"
              />

            </div>


            {/* READ PERCENTAGE */}

            <div className="field">

              <label>
                Read Percentage (%)
              </label>

              <input
                type="number"
                name="readPercentage"
                value={form.readPercentage}
                onChange={handleChange}
                min="0"
                max="100"
              />

            </div>


            {/* WRITE PERCENTAGE */}

            <div className="field">

              <label>
                Write Percentage (%)
              </label>

              <input
                type="number"
                name="writePercentage"
                value={form.writePercentage}
                onChange={handleChange}
                min="0"
                max="100"
              />

            </div>


            {/* LATENCY */}

            <div className="field">

              <label>
                Latency Requirement
              </label>

              <select
                name="latencyRequirement"
                value={form.latencyRequirement}
                onChange={handleChange}
              >

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

            </div>


            {/* ACCESS FREQUENCY */}

            <div className="field">

              <label>
                Access Frequency
              </label>

              <select
                name="accessFrequency"
                value={form.accessFrequency}
                onChange={handleChange}
              >

                <option value="very_high">
                  Very High
                </option>

                <option value="high">
                  High
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="low">
                  Low
                </option>

              </select>

            </div>


            {/* COST SENSITIVITY */}

            <div className="field">

              <label>
                Cost Sensitivity
              </label>

              <select
                name="costSensitivity"
                value={form.costSensitivity}
                onChange={handleChange}
              >

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

            </div>

          </div>


          {/* ANALYZE BUTTON */}

          <button
            className="analyze-button"
            onClick={analyzeWorkload}
            disabled={loading}
          >

            {loading
              ? "Analyzing..."
              : "Analyze Workload"}

          </button>

        </section>


        {/* ====================================
            RECOMMENDATION
        ==================================== */}

        {result && !result.error && (

          <section className="result-card">

            <h2>
              Recommendation
            </h2>


            <div className="recommendation">

              <span>
                Recommended Performance Tier
              </span>

              <strong>
                {result.recommendation}
              </strong>

            </div>


            <div className="scores">


              <div>

                <span>
                  Standard Score
                </span>

                <strong>
                  {result.standardScore}
                </strong>

              </div>


              <div>

                <span>
                  Premium Score
                </span>

                <strong>
                  {result.premiumScore}
                </strong>

              </div>


            </div>


            <div className="reasons">

              <h3>
                Why this recommendation?
              </h3>


              {result.reasons &&
                result.reasons.map(
                  (reason, index) => (

                    <div
                      className="reason"
                      key={index}
                    >

                      ✓ {reason}

                    </div>

                  )
                )}

            </div>

          </section>

        )}
{/* ====================================
    HOW RECOMMENDATION WORKS
==================================== */}

<section className="decision-card">

  <h2>
    How Recommendation Works
  </h2>

  <p className="decision-description">
    The analyzer evaluates workload characteristics using
    a rule-based scoring model and compares Standard and
    Premium performance options.
  </p>


  <div className="decision-flow">


    <div className="flow-step">

      <div className="flow-number">
        1
      </div>

      <h3>
        Workload Input
      </h3>

      <p>
        Request rate, read/write ratio, latency,
        access frequency and cost sensitivity.
      </p>

    </div>


    <div className="flow-arrow">
      →
    </div>


    <div className="flow-step">

      <div className="flow-number">
        2
      </div>

      <h3>
        Rule-Based Scoring
      </h3>

      <p>
        Each workload characteristic contributes
        points to the Standard or Premium score.
      </p>

    </div>


    <div className="flow-arrow">
      →
    </div>


    <div className="flow-step">

      <div className="flow-number">
        3
      </div>

      <h3>
        Score Comparison
      </h3>

      <p>
        The Standard and Premium scores are
        compared based on the workload.
      </p>

    </div>


    <div className="flow-arrow">
      →
    </div>


    <div className="flow-step">

      <div className="flow-number">
        4
      </div>

      <h3>
        Recommendation
      </h3>

      <p>
        The system displays the selected
        performance option with reasons.
      </p>

    </div>


  </div>


  <div className="decision-note">

    <strong>
      Azure Benchmark Evidence
    </strong>

    <p>
      The recommendation is presented alongside
      measured Azure Blob Storage benchmark results
      to provide experimental performance evidence.
    </p>

  </div>

</section>

        {/* ====================================
            ERROR
        ==================================== */}

        {result?.error && (

          <section className="error-card">

            {result.error}

          </section>

        )}


        {/* ====================================
            AZURE BENCHMARK
        ==================================== */}

        <section className="benchmark-card">

          <h2>
            Azure Benchmark Results
          </h2>


          <p className="subtitle">

            Actual download performance measured
            from the Azure Blob Storage workload.

          </p>


          {benchmarkLoading ? (

            <p>
              Loading benchmark results...
            </p>

          ) : (

            <div>


              {/* ==================================
                  BENCHMARK TABLE
              ================================== */}

              <div className="table-container">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Workload
                      </th>

                      <th>
                        Size
                      </th>

                      <th>
                        Download Time
                      </th>

                      <th>
                        Throughput
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {benchmarkResults.map(
                      (item, index) => (

                        <tr key={index}>

                          <td>
                            {item.file}
                          </td>

                          <td>
                            {item.size_mb} MB
                          </td>

                          <td>
                            {item.download_time_sec} sec
                          </td>

                          <td>
                            {item.throughput_mb_s} MB/s
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* ==================================
                  CHARTS
              ================================== */}

              <div className="charts-section">


                {/* THROUGHPUT CHART */}

                <div className="chart-card">

                  <h3>
                    Throughput vs File Size
                  </h3>


                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >

                    <BarChart
                      data={benchmarkResults}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />


                      <XAxis
                        dataKey="size_mb"
                        label={{
                          value: "File Size (MB)",
                          position: "insideBottom",
                          offset: -5
                        }}
                      />


                      <YAxis
                        label={{
                          value: "Throughput (MB/s)",
                          angle: -90,
                          position: "insideLeft"
                        }}
                      />


                      <Tooltip />


                      <Bar
                        dataKey="throughput_mb_s"
                        name="Throughput"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>


                {/* DOWNLOAD TIME CHART */}

                <div className="chart-card">

                  <h3>
                    Download Time vs File Size
                  </h3>


                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >

                    <BarChart
                      data={benchmarkResults}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />


                      <XAxis
                        dataKey="size_mb"
                        label={{
                          value: "File Size (MB)",
                          position: "insideBottom",
                          offset: -5
                        }}
                      />


                      <YAxis
                        label={{
                          value: "Download Time (seconds)",
                          angle: -90,
                          position: "insideLeft"
                        }}
                      />


                      <Tooltip />


                      <Bar
                        dataKey="download_time_sec"
                        name="Download Time"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>


              {/* ==================================
                  PERFORMANCE SUMMARY
              ================================== */}

              <div className="performance-summary">

                <h3>
                  Performance Summary
                </h3>


                <div className="summary-grid">


                  {/* AVERAGE THROUGHPUT */}

                  <div className="summary-item">

                    <span>
                      Average Throughput
                    </span>

                    <strong>
                      {averageThroughput} MB/s
                    </strong>

                  </div>


                  {/* LARGEST FILE */}

                  <div className="summary-item">

                    <span>
                      Largest File Tested
                    </span>

                    <strong>
                      {largestFile} MB
                    </strong>

                  </div>


                  {/* TOTAL DATA */}

                  <div className="summary-item">

                    <span>
                      Total Data Tested
                    </span>

                    <strong>
                      {totalData} MB
                    </strong>

                  </div>


                  {/* FASTEST DOWNLOAD */}

                  <div className="summary-item">

                    <span>
                      Fastest Download
                    </span>

                    <strong>
                      {fastestDownload} sec
                    </strong>

                  </div>


                  {/* SLOWEST DOWNLOAD */}

                  <div className="summary-item">

                    <span>
                      Slowest Download
                    </span>

                    <strong>
                      {slowestDownload} sec
                    </strong>

                  </div>


                </div>

              </div>


            </div>

          )}

        </section>


      </main>

    </div>

  );

}
export default App;