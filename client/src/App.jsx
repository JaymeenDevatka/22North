import { useEffect, useMemo, useState } from "react";
import { analyzeImportedCsv, loadDashboard, loadImportHistory } from "./api";
import {
  COLUMN_MAPPING_GUIDE,
  buildImportPreview,
  getSampleCsvTemplate,
  normalizeImportedResources,
  parseCsvText,
} from "./csv";

const filters = [
  "All",
  "rightsize",
  "schedule",
  "cleanup",
  "commitment",
  "network-optimization",
];

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatLabel(value) {
  const map = {
    rightsize: "Rightsize",
    schedule: "Schedule",
    cleanup: "Cleanup",
    commitment: "Commitment",
    "network-optimization": "Network",
  };

  return map[value] || value;
}

function App() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    dashboard: null,
    meta: null,
    mode: "sample",
  });
  const [importState, setImportState] = useState({
    fileName: "",
    budget: "15000",
    preview: null,
    parsedResources: [],
    error: null,
    loading: false,
  });
  const [importHistory, setImportHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [reviewedIds, setReviewedIds] = useState([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadDashboard(), loadImportHistory()])
      .then(([dashboardPayload, historyPayload]) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            dashboard: dashboardPayload.dashboard,
            meta: dashboardPayload.meta,
            mode: dashboardPayload.mode,
          });
          setImportHistory(historyPayload.imports || []);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: error.message,
            dashboard: null,
            meta: null,
            mode: "sample",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const importPreview = useMemo(() => {
    if (!importState.parsedResources.length) {
      return null;
    }

    return buildImportPreview(importState.parsedResources);
  }, [importState.parsedResources]);

  const csvTemplate = useMemo(() => getSampleCsvTemplate(), []);

  if (state.loading) {
    return (
      <div className="app-shell loading-state">
        Loading 22North Cloud Cost Intelligence...
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="app-shell error-state">
        <h1>22North — Cloud Cost Intelligence Platform</h1>
        <p>{state.error}</p>
      </div>
    );
  }

  const recommendations = (state.dashboard?.recommendations || []).filter(
    (item) => {
      if (activeFilter === "All") {
        return true;
      }

      return item.recommendationType === activeFilter;
    },
  );

  const summary = state.dashboard?.summary || {};
  const serviceBreakdown = state.dashboard?.serviceBreakdown || [];

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const records = parseCsvText(text);

      if (!records.length) {
        setImportState((current) => ({
          ...current,
          fileName: file.name,
          preview: null,
          parsedResources: [],
          error: "The file did not contain any data rows.",
        }));
        return;
      }

      const normalizedResources = normalizeImportedResources(records);

      setImportState((current) => ({
        ...current,
        fileName: file.name,
        preview: buildImportPreview(normalizedResources),
        parsedResources: normalizedResources,
        error: null,
      }));
    } catch (error) {
      setImportState((current) => ({
        ...current,
        fileName: file.name,
        preview: null,
        parsedResources: [],
        error: "Unable to read the CSV file.",
      }));
    }
  };

  const handleReset = async () => {
    setImportState({
      fileName: "",
      budget: "15000",
      preview: null,
      parsedResources: [],
      error: null,
      loading: false,
    });
    setActiveFilter("All");
    setReviewedIds([]);

    try {
      const [payload, historyPayload] = await Promise.all([
        loadDashboard(),
        loadImportHistory(),
      ]);
      setState({
        loading: false,
        error: null,
        dashboard: payload.dashboard,
        meta: payload.meta,
        mode: payload.mode,
      });
      setImportHistory(historyPayload.imports || []);
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    }
  };

  const handleAnalyzeImport = async () => {
    if (!importState.parsedResources.length) {
      setImportState((current) => ({
        ...current,
        error: "Choose a CSV file before analysing it.",
      }));
      return;
    }

    setImportState((current) => ({ ...current, loading: true, error: null }));

    try {
      const response = await analyzeImportedCsv({
        fileName: importState.fileName || "uploaded.csv",
        account: {
          name: importState.fileName.replace(/\.csv$/i, "") || "Imported CSV",
          monthlyBudget: Number(importState.budget || 15000),
        },
        resources: importState.parsedResources,
      });

      setState((current) => ({
        ...current,
        dashboard: response.dashboard,
        mode: response.mode || "imported",
      }));
      if (response.importRun) {
        setImportHistory((current) =>
          [response.importRun, ...current].slice(0, 5),
        );
      }
      setActiveFilter("All");
      setReviewedIds([]);
      setImportState((current) => ({
        ...current,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setImportState((current) => ({
        ...current,
        loading: false,
        error: error.message,
      }));
    }
  };

  const toggleReviewed = (id) => {
    setReviewedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="hero card surface">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">22North · Challenge 5 · Hackathon 2026</span>
            <span
              className={`mode-pill ${state.mode === "mysql" ? "mode-live" : "mode-sample"}`}
            >
              {state.mode === "mysql" ? "MySQL-backed" : "Sample data fallback"}
            </span>
          </div>
          <h1>
            Turning cloud costs into business insights.
          </h1>
          <p>
            Upload → Analyze → Visualize → Save. Get actionable savings
            recommendations without complex live cloud integrations.
          </p>
          <div className="hero-actions">
            <div className="hero-stat">
              <span>Monthly spend</span>
              <strong>{formatMoney(summary.monthlySpend)}</strong>
            </div>
            <div className="hero-stat">
              <span>Projected savings</span>
              <strong>{formatMoney(summary.projectedSavings)}</strong>
            </div>
            <div className="hero-stat">
              <span>Coverage of budget</span>
              <strong>{summary.coveragePct || 0}%</strong>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-inner">
            <span className="panel-label">Top opportunity</span>
            <h2>
              {summary.highestValueRecommendation?.recommendationTitle ||
                "No recommendation available"}
            </h2>
            <p>{summary.highestValueRecommendation?.action}</p>
            <div className="panel-metric-grid">
              <div>
                <span>High priority items</span>
                <strong>{summary.highPriorityCount || 0}</strong>
              </div>
              <div>
                <span>Net after optimisation</span>
                <strong>{formatMoney(summary.netAfterOptimization)}</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="card surface section-card import-panel">
        <div className="section-header compact">
          <div>
            <span className="section-kicker">CSV import</span>
            <h3>Upload a billing export or sample inventory</h3>
          </div>
          <div className="import-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                const blob = new Blob([csvTemplate], {
                  type: "text/csv;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "cloud-cost-intelligence-sample.csv";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download template
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={handleReset}
            >
              Reset dashboard
            </button>
          </div>
        </div>

        <div className="import-grid">
          <div className="import-form">
            <label className="import-field">
              <span>Select CSV file</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
              />
            </label>
            <label className="import-field">
              <span>Monthly budget</span>
              <input
                type="number"
                min="0"
                step="100"
                value={importState.budget}
                onChange={(event) =>
                  setImportState((current) => ({
                    ...current,
                    budget: event.target.value,
                  }))
                }
              />
            </label>
            <div className="import-note">
              The CSV should include headers such as <strong>service</strong>,{" "}
              <strong>monthly_cost</strong>,<strong>utilization_pct</strong>,
              and <strong>estimated_monthly_savings</strong>. Quoted values and
              commas inside text fields are supported.
            </div>
            <div className="mapping-help">
              <span className="mapping-help-label">
                Accepted headers and aliases
              </span>
              <div className="mapping-chip-grid">
                {COLUMN_MAPPING_GUIDE.map((item) => (
                  <div className="mapping-chip" key={item.field}>
                    <strong>{item.field}</strong>
                    <small>{item.aliases.join(", ")}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="import-actions inline">
              <button
                type="button"
                className="primary-button"
                onClick={handleAnalyzeImport}
                disabled={importState.loading}
              >
                {importState.loading ? "Analysing..." : "Analyse CSV"}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setActiveFilter("All")}
              >
                Clear filters
              </button>
            </div>
            {importState.error ? (
              <p className="import-error">{importState.error}</p>
            ) : null}
          </div>

          <div className="import-preview">
            <div className="import-preview-grid">
              <div className="mini-metric">
                <span>File</span>
                <strong>{importState.fileName || "No file selected"}</strong>
              </div>
              <div className="mini-metric">
                <span>Rows</span>
                <strong>{importPreview?.resourceCount || 0}</strong>
              </div>
              <div className="mini-metric">
                <span>Spend</span>
                <strong>{formatMoney(importPreview?.totalSpend)}</strong>
              </div>
              <div className="mini-metric">
                <span>Projected savings</span>
                <strong>{formatMoney(importPreview?.totalSavings)}</strong>
              </div>
            </div>

            <div className="import-sample-list">
              {(importState.parsedResources.slice(0, 3) || []).map((item) => (
                <div
                  className="import-sample-row"
                  key={`${item.service}-${item.id}`}
                >
                  <span>{item.service}</span>
                  <small>{item.resourceName}</small>
                  <strong>{formatMoney(item.monthlyCost)}</strong>
                </div>
              ))}
              {!importState.parsedResources.length ? (
                <div className="empty-import-state">
                  Upload a CSV to preview the imported resources before applying
                  the analysis.
                </div>
              ) : null}
            </div>

            <div className="history-panel">
              <div className="history-panel-header">
                <span className="section-kicker">Import history</span>
                <strong>{importHistory.length} recent runs</strong>
              </div>
              <div className="history-list">
                {importHistory.length ? (
                  importHistory.map((item) => (
                    <div
                      className="history-item"
                      key={`${item.fileName}-${item.id}`}
                    >
                      <div>
                        <strong>{item.fileName}</strong>
                        <p>{item.accountName}</p>
                      </div>
                      <div className="history-metrics">
                        <span>{item.resourceCount} rows</span>
                        <small>
                          {formatMoney(item.projectedSavings)} saved
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-import-state">
                    No uploads yet. Analyse a CSV to create the first history
                    entry.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="card kpi-card">
          <span>Total monthly spend</span>
          <strong>{formatMoney(summary.monthlySpend)}</strong>
          <p>Across {summary.resourceCount || 0} sampled cloud resources.</p>
        </article>
        <article className="card kpi-card">
          <span>Projected savings</span>
          <strong>{formatMoney(summary.projectedSavings)}</strong>
          <p>
            {summary.savingsPct || 0}% of current spend can be reduced with
            low-friction actions.
          </p>
        </article>
        <article className="card kpi-card">
          <span>Largest concentration</span>
          <strong>{summary.topService || "N/A"}</strong>
          <p>Service with the highest current spend in this sample dataset.</p>
        </article>
        <article className="card kpi-card">
          <span>Optimisation score</span>
          <strong>{summary.savingsPct || 0}%</strong>
          <p>Directional savings coverage derived from the sample inventory.</p>
        </article>
      </section>

      <section className="content-grid">
        <div className="card surface section-card">
          <div className="section-header">
            <div>
              <span className="section-kicker">Actionable savings</span>
              <h3>Ranked recommendations</h3>
            </div>
            <div className="filter-row">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-chip ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {formatLabel(filter)}
                </button>
              ))}
            </div>
          </div>

          <div className="recommendation-list">
            {recommendations.map((item) => {
              const reviewed = reviewedIds.includes(item.id);

              return (
                <article
                  className={`recommendation-card ${reviewed ? "reviewed" : ""}`}
                  key={item.id}
                >
                  <div className="recommendation-main">
                    <div className="recommendation-copy">
                      <div className="title-row">
                        <span
                          className={`severity ${item.priority.toLowerCase()}`}
                        >
                          {item.priority}
                        </span>
                        <span className="service-tag">{item.service}</span>
                      </div>
                      <h4>{item.recommendationTitle}</h4>
                      <p>{item.recommendationDetail}</p>
                    </div>
                    <div className="recommendation-metrics">
                      <strong>
                        {formatMoney(item.estimatedMonthlySavings)}
                      </strong>
                      <span>savings / month</span>
                      <small>{item.confidence}% confidence</small>
                    </div>
                  </div>

                  <div className="recommendation-footer">
                    <div className="detail-pill-group">
                      <span>{item.environment}</span>
                      <span>{item.ownerTeam}</span>
                      <span>{item.effort} effort</span>
                      <span>{item.utilizationPct}% util.</span>
                    </div>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => toggleReviewed(item.id)}
                    >
                      {reviewed ? "Reviewed" : "Mark reviewed"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="sidebar-stack">
          <div className="card surface section-card">
            <div className="section-header compact">
              <div>
                <span className="section-kicker">Spend mix</span>
                <h3>Service breakdown</h3>
              </div>
            </div>
            <div className="bar-chart">
              {serviceBreakdown.map((item) => (
                <div className="bar-row" key={item.service}>
                  <div className="bar-labels">
                    <span>{item.service}</span>
                    <small>{formatMoney(item.spend)}</small>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.max(12, Math.min(100, (item.spend / (summary.monthlySpend || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card surface section-card">
            <div className="section-header compact">
              <div>
                <span className="section-kicker">What the business sees</span>
                <h3>Customer journey</h3>
              </div>
            </div>
            <div className="journey-list">
              {(state.meta?.customerJourney || []).map((step, index) => (
                <div className="journey-item" key={step.title}>
                  <span className="journey-index">0{index + 1}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="card surface section-card meta-grid">
        <div>
          <span className="section-kicker">Architecture</span>
          <h3>Clean, simple, and easy to extend</h3>
          <div className="architecture-grid">
            {(state.meta?.architecture || []).map((item) => (
              <article className="mini-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="split-panel">
          <div>
            <span className="section-kicker">Assumptions</span>
            <ul className="bullet-list">
              {(state.meta?.assumptions || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="section-kicker">API design</span>
            <div className="api-table">
              {(state.meta?.apiCatalog || []).map((endpoint) => (
                <div className="api-row" key={endpoint.path}>
                  <span className="http-method">{endpoint.method}</span>
                  <span className="api-path">{endpoint.path}</span>
                  <p>{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-note">
        <p>
          <strong>22North — Cloud Cost Intelligence Platform</strong> · Challenge
          5 · Hackathon 2026 ·{" "}
          <a
            href="https://github.com/JaymeenDevatka/22North"
            target="_blank"
            rel="noreferrer"
          >
            github.com/JaymeenDevatka/22North
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
