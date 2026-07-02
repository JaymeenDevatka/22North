const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return response.json();
}

export async function loadDashboard() {
  const [dashboard, meta] = await Promise.all([
    request("/api/dashboard"),
    request("/api/meta"),
  ]);

  return {
    dashboard,
    meta,
    mode: dashboard.mode || "sample",
  };
}

export async function loadImportHistory() {
  const response = await request("/api/imports");

  return {
    imports: response.imports || [],
    mode: response.mode || "sample",
  };
}

export async function analyzeImportedCsv(payload) {
  const response = await fetch(`${API_BASE}/api/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to analyse the uploaded CSV.");
  }

  return response.json();
}
