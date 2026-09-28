import { useState } from "react";
import "./App.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const DEFAULT_INPUT = {
  // Replace with the exact feature names and values your backend expects.
  example_field: "replace_with_model_input"
};

export default function App() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(DEFAULT_INPUT, null, 2));
  const [apiStatus, setApiStatus] = useState("unknown");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function checkBackend() {
    setApiStatus("checking");
    setError("");
    if (!API_BASE_URL) {
      setApiStatus("disconnected");
      setError("VITE_API_URL is not configured. Add it in Vercel Environment Variables.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { response: text }; }
      if (!response.ok) throw new Error(data.detail || `Health check returned HTTP ${response.status}`);
      setApiStatus("connected");
      setResult(data);
    } catch (err) {
      setApiStatus("disconnected");
      setError(`${err.message}. Check backend status, URL, and CORS configuration.`);
    }
  }

  async function submitPrediction(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!API_BASE_URL) {
      setError("Backend URL is missing. Configure VITE_API_URL.");
      return;
    }

    let payload;
    try {
      payload = JSON.parse(jsonInput);
    } catch {
      setError("Invalid JSON. Please correct the request body and try again.");
      return;
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      setError("Enter a JSON object containing the model input.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { response: text }; }
      if (!response.ok) {
        throw new Error(data.detail || data.message || `Prediction failed: HTTP ${response.status}`);
      }
      setResult(data);
      setApiStatus("connected");
    } catch (err) {
      setError(`${err.message}. Confirm that /predict is available and accepts this JSON format.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">R</span>
          <span>RWA<span className="brand-light">·</span>SAMK</span>
        </a>
        <div className="topbar-right">
          <span className="model-tag">ANN + Tiny ViT + XAI</span>
          <span className={`status-pill ${apiStatus}`}>
            <span className="status-dot" />
            {apiStatus === "connected" ? "Backend connected" :
             apiStatus === "checking" ? "Checking..." :
             apiStatus === "disconnected" ? "Disconnected" : "Not checked"}
          </span>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-line" />AI-POWERED INVESTOR ASSESSMENT</div>
          <h1>Real-world assets.<br /><span>Intelligent eligibility.</span></h1>
          <p className="hero-description">
            Submit investor data to your deployed machine-learning API and inspect its response.
          </p>
          <div className="hero-actions">
            <button className="button button-secondary" onClick={checkBackend} disabled={apiStatus === "checking"} type="button">
              {apiStatus === "checking" ? "Checking..." : "Test backend connection"}
            </button>
            <span className="endpoint-hint">GET /health · POST /predict</span>
          </div>
        </section>

        <section className="workspace">
          <div className="panel">
            <div className="panel-heading">
              <div><div className="panel-kicker">01 / INPUT</div><h2>Investor request</h2></div>
              <span className="panel-icon">↗</span>
            </div>
            <p className="panel-description">
              Enter a JSON object matching the feature schema expected by your backend.
            </p>
            <form onSubmit={submitPrediction}>
              <label className="field-label" htmlFor="json-input">MODEL INPUT · JSON</label>
              <textarea
                id="json-input"
                className="json-editor"
                spellCheck="false"
                value={jsonInput}
                onChange={(event) => setJsonInput(event.target.value)}
                aria-label="JSON model input"
              />
              <div className="editor-footer">
                <span>Content-Type: application/json</span>
                <button type="button" className="text-button" onClick={() => {
                  setJsonInput(JSON.stringify(DEFAULT_INPUT, null, 2));
                  setResult(null);
                  setError("");
                }}>Reset example</button>
              </div>
              <button className="button button-primary submit-button" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" />Processing request...</> : <>Run model request <span aria-hidden="true">→</span></>}
              </button>
            </form>
            <div className="privacy-note">
              <span aria-hidden="true">ⓘ</span>
              Use test or appropriately protected data. Avoid entering passwords, identity numbers, or unnecessary personal information.
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div><div className="panel-kicker">02 / OUTPUT</div><h2>Model response</h2></div>
              <span className="result-badge">{result ? "Response received" : "Awaiting request"}</span>
            </div>

            {error && <div className="error-box" role="alert"><strong>Request issue</strong><p>{error}</p></div>}
            {!result && !error && (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <h3>Results will appear here</h3>
                <p>Check the backend connection or submit a JSON request to view the API response.</p>
              </div>
            )}
            {result && (
              <div className="response-content">
                <div className="response-topline"><span className="response-indicator" />API returned a response</div>
                <pre className="response-json">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        </section>

        <section className="pipeline">
          <div className="pipeline-title">INFERENCE WORKFLOW</div>
          <div className="pipeline-steps">
            <div className="pipeline-step"><span className="step-number">01</span><span>Investor input</span></div>
            <span className="pipeline-arrow">→</span>
            <div className="pipeline-step"><span className="step-number">02</span><span>Preprocessing</span></div>
            <span className="pipeline-arrow">→</span>
            <div className="pipeline-step"><span className="step-number">03</span><span>ANN + Tiny ViT</span></div>
            <span className="pipeline-arrow">→</span>
            <div className="pipeline-step"><span className="step-number">04</span><span>Fusion + XAI</span></div>
          </div>
          <p className="pipeline-note">
            Workflow illustration. Actual predictions and explanations depend on your backend inference implementation.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>Extended RWA-SAMK · Research prototype</span>
        <span>Frontend hosted on Vercel</span>
      </footer>
    </div>
  );
}
