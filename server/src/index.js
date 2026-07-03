require("dotenv").config();

const cors = require("cors");
const express = require("express");
const sampleData = require("./sampleData");
const {
  buildDashboard,
  buildMeta,
  normalizeImportedResource,
} = require("./insights");
const {
  getMode,
  loadAccount,
  loadImportRuns,
  loadResources,
  saveImportRun,
} = require("./store");

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.json({
    ok: true,
    mode: getMode(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/resources", async (request, response) => {
  try {
    const resources = await loadResources();
    response.json({ resources, mode: getMode() });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Unable to load resources.", error: error.message });
  }
});

app.get("/api/dashboard", async (request, response) => {
  try {
    const [account, resources] = await Promise.all([
      loadAccount(),
      loadResources(),
    ]);
    response.json(buildDashboard(account, resources, getMode()));
  } catch (error) {
    response
      .status(500)
      .json({ message: "Unable to build dashboard.", error: error.message });
  }
});

app.get("/api/meta", (request, response) => {
  response.json(buildMeta());
});

app.get("/api/imports", async (request, response) => {
  try {
    const imports = await loadImportRuns();
    response.json({ imports, mode: getMode() });
  } catch (error) {
    response.status(500).json({
      message: "Unable to load import history.",
      error: error.message,
    });
  }
});

app.post("/api/import", async (request, response) => {
  try {
    const {
      account = {},
      resources = [],
      fileName = "uploaded.csv",
    } = request.body || {};

    if (!Array.isArray(resources) || !resources.length) {
      return response.status(400).json({
        message: "The uploaded file did not contain any rows to analyse.",
      });
    }

    const normalizedResources = resources.map((resource, index) =>
      normalizeImportedResource(resource, index),
    );
    const importedAccount = {
      ...sampleData.accounts[0],
      ...account,
      monthlyBudget: Number(
        account.monthlyBudget || sampleData.accounts[0].monthlyBudget,
      ),
      name: account.name || fileName.replace(/\.csv$/i, "") || "Imported CSV",
    };
    const dashboard = buildDashboard(
      importedAccount,
      normalizedResources,
      "imported",
    );
    const importRun = await saveImportRun({
      fileName,
      accountName: importedAccount.name,
      resourceCount: dashboard.summary.resourceCount,
      totalSpend: dashboard.summary.monthlySpend,
      projectedSavings: dashboard.summary.projectedSavings,
      mode: "imported",
    });

    return response.json({
      mode: "imported",
      fileName,
      dashboard,
      importRun,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Unable to analyse the uploaded CSV.",
      error: error.message,
    });
  }
});

app.listen(port, () => {
    console.log(
    `22North Cloud Cost Intelligence API listening on http://localhost:${port}`,
  );
});
