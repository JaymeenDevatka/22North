const mysql = require("mysql2/promise");
const sampleData = require("./sampleData");

let poolPromise;
let mode = "sample";

function hasMysqlConfig() {
  return Boolean(
    process.env.MYSQL_HOST &&
    process.env.MYSQL_USER &&
    process.env.MYSQL_DATABASE,
  );
}

function toNumber(value) {
  return Number.parseFloat(value ?? 0) || 0;
}

function normalizeResource(row) {
  return {
    id: Number(row.id),
    accountId: Number(row.account_id ?? row.accountId ?? 1),
    accountName: row.account_name ?? row.accountName ?? "Northstar SaaS",
    monthlyBudget: toNumber(row.monthly_budget ?? row.monthlyBudget ?? 15000),
    service: row.service,
    resourceName: row.resource_name ?? row.resourceName,
    environment: row.environment,
    region: row.region,
    status: row.status,
    utilizationPct: toNumber(row.utilization_pct ?? row.utilizationPct),
    monthlyCost: toNumber(row.monthly_cost ?? row.monthlyCost),
    ownerTeam: row.owner_team ?? row.ownerTeam,
    lastUsedDays: Number(row.last_used_days ?? row.lastUsedDays ?? 0),
    recommendationType: row.recommendation_type ?? row.recommendationType,
    recommendationTitle: row.recommendation_title ?? row.recommendationTitle,
    recommendationDetail: row.recommendation_detail ?? row.recommendationDetail,
    estimatedMonthlySavings: toNumber(
      row.estimated_monthly_savings ?? row.estimatedMonthlySavings,
    ),
    priority: row.priority,
  };
}

function normalizeImportRun(row) {
  return {
    id: Number(row.id),
    fileName: row.file_name ?? row.fileName,
    accountName: row.account_name ?? row.accountName,
    resourceCount: Number(row.resource_count ?? row.resourceCount ?? 0),
    totalSpend: toNumber(row.total_spend ?? row.totalSpend),
    projectedSavings: toNumber(row.projected_savings ?? row.projectedSavings),
    mode: row.mode,
    createdAt: row.created_at ?? row.createdAt,
  };
}

async function getPool() {
  if (!poolPromise) {
    poolPromise = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
    });
  }

  return poolPromise;
}

async function loadResources() {
  if (!hasMysqlConfig()) {
    mode = "sample";
    return sampleData.resources;
  }

  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT r.*, a.name AS account_name, a.monthly_budget FROM resources r INNER JOIN accounts a ON a.id = r.account_id ORDER BY r.estimated_monthly_savings DESC, r.monthly_cost DESC",
    );

    mode = "mysql";
    return rows.map(normalizeResource);
  } catch (error) {
    console.warn(
      "MySQL unavailable, using bundled sample data instead.",
      error.message,
    );
    mode = "sample";
    return sampleData.resources;
  }
}

async function loadAccount() {
  if (!hasMysqlConfig()) {
    return sampleData.accounts[0];
  }

  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT id, name, industry, monthly_budget AS monthlyBudget FROM accounts ORDER BY id LIMIT 1",
    );
    if (!rows.length) {
      return sampleData.accounts[0];
    }

    const row = rows[0];
    return {
      id: Number(row.id),
      name: row.name,
      industry: row.industry,
      monthlyBudget: toNumber(row.monthlyBudget),
    };
  } catch (error) {
    console.warn(
      "Account lookup failed, using bundled sample account.",
      error.message,
    );
    return sampleData.accounts[0];
  }
}

async function loadImportRuns(limit = 5) {
  if (!hasMysqlConfig()) {
    return sampleData.importRuns.slice(0, limit);
  }

  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT id, file_name, account_name, resource_count, total_spend, projected_savings, mode, created_at FROM import_runs ORDER BY id DESC LIMIT ?",
      [limit],
    );

    mode = "mysql";
    return rows.map(normalizeImportRun);
  } catch (error) {
    console.warn(
      "Import run history unavailable, using bundled sample data instead.",
      error.message,
    );
    return sampleData.importRuns.slice(0, limit);
  }
}

async function saveImportRun(entry) {
  const record = {
    fileName: entry.fileName,
    accountName: entry.accountName,
    resourceCount: Number(entry.resourceCount || 0),
    totalSpend: toNumber(entry.totalSpend),
    projectedSavings: toNumber(entry.projectedSavings),
    mode: entry.mode || mode,
  };

  if (!hasMysqlConfig()) {
    return {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...record,
    };
  }

  try {
    const pool = await getPool();
    const [result] = await pool.query(
      "INSERT INTO import_runs (file_name, account_name, resource_count, total_spend, projected_savings, mode) VALUES (?, ?, ?, ?, ?, ?)",
      [
        record.fileName,
        record.accountName,
        record.resourceCount,
        record.totalSpend,
        record.projectedSavings,
        record.mode,
      ],
    );

    return {
      id: result.insertId,
      createdAt: new Date().toISOString(),
      ...record,
    };
  } catch (error) {
    console.warn(
      "Unable to persist import run, returning transient record instead.",
      error.message,
    );
    return {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...record,
    };
  }
}

function getMode() {
  return mode;
}

module.exports = {
  loadResources,
  loadAccount,
  loadImportRuns,
  saveImportRun,
  getMode,
};
