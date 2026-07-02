const COLUMN_ALIASES = {
  id: ["id", "resource_id", "resourceid"],
  service: ["service"],
  resourceName: ["resource_name", "resourcename", "name"],
  environment: ["environment", "env"],
  region: ["region", "location"],
  status: ["status"],
  utilizationPct: ["utilization_pct", "utilizationpct", "utilization"],
  monthlyCost: ["monthly_cost", "monthlycost", "cost", "monthly_spend"],
  ownerTeam: ["owner_team", "ownerteam", "team"],
  lastUsedDays: ["last_used_days", "lastuseddays", "days_unused"],
  recommendationType: ["recommendation_type", "recommendationtype", "type"],
  recommendationTitle: ["recommendation_title", "recommendationtitle", "title"],
  recommendationDetail: [
    "recommendation_detail",
    "recommendationdetail",
    "detail",
  ],
  estimatedMonthlySavings: [
    "estimated_monthly_savings",
    "estimatedmonthlysavings",
    "savings",
    "expected_savings",
  ],
  priority: ["priority", "severity"],
};

const COLUMN_MAPPING_GUIDE = Object.entries(COLUMN_ALIASES).map(
  ([field, aliases]) => ({
    field,
    aliases,
  }),
);

const TEMPLATE_ROWS = [
  [
    "service",
    "resource_name",
    "environment",
    "region",
    "status",
    "utilization_pct",
    "monthly_cost",
    "owner_team",
    "last_used_days",
    "recommendation_type",
    "recommendation_title",
    "recommendation_detail",
    "estimated_monthly_savings",
    "priority",
  ],
  [
    "EC2",
    "api-worker-3",
    "prod",
    "us-east-1",
    "active",
    "12",
    "2480",
    "Platform",
    "8",
    "rightsize",
    "Rightsize the API worker fleet",
    "Under 15% utilization, so the instance family can be reduced safely.",
    "930",
    "high",
  ],
  [
    "RDS",
    "staging-db",
    "staging",
    "us-east-1",
    "idle",
    "4",
    "640",
    "Data",
    "21",
    "schedule",
    "Schedule staging database shutdown windows",
    "Mostly idle outside working hours and can be powered down nightly and on weekends.",
    "380",
    "high",
  ],
];

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function parseCsvText(text) {
  const rows = [];
  const currentRow = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(currentValue);
      if (currentRow.some((cell) => String(cell).trim().length > 0)) {
        rows.push(currentRow.slice());
      }
      currentRow.length = 0;
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue);
    if (currentRow.some((cell) => String(cell).trim().length > 0)) {
      rows.push(currentRow.slice());
    }
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => normalizeHeader(header));

  return rows.slice(1).map((row) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });

    return record;
  });
}

function toNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pickValue(record, aliases) {
  for (const alias of aliases) {
    if (record[alias] !== undefined && String(record[alias]).trim() !== "") {
      return record[alias];
    }
  }

  return "";
}

function normalizeImportedResource(record, index) {
  return {
    id: toNumber(pickValue(record, COLUMN_ALIASES.id), index + 1),
    service: pickValue(record, COLUMN_ALIASES.service) || "Unknown",
    resourceName:
      pickValue(record, COLUMN_ALIASES.resourceName) || `resource-${index + 1}`,
    environment: pickValue(record, COLUMN_ALIASES.environment) || "unknown",
    region: pickValue(record, COLUMN_ALIASES.region) || "unknown",
    status: pickValue(record, COLUMN_ALIASES.status) || "active",
    utilizationPct: toNumber(pickValue(record, COLUMN_ALIASES.utilizationPct)),
    monthlyCost: toNumber(pickValue(record, COLUMN_ALIASES.monthlyCost)),
    ownerTeam: pickValue(record, COLUMN_ALIASES.ownerTeam) || "Unassigned",
    lastUsedDays: toNumber(pickValue(record, COLUMN_ALIASES.lastUsedDays)),
    recommendationType:
      pickValue(record, COLUMN_ALIASES.recommendationType) || "rightsize",
    recommendationTitle:
      pickValue(record, COLUMN_ALIASES.recommendationTitle) ||
      "Review the resource",
    recommendationDetail:
      pickValue(record, COLUMN_ALIASES.recommendationDetail) ||
      "The imported row does not include a detailed recommendation, so a generic review was created.",
    estimatedMonthlySavings: toNumber(
      pickValue(record, COLUMN_ALIASES.estimatedMonthlySavings),
    ),
    priority: String(pickValue(record, COLUMN_ALIASES.priority) || "medium")
      .trim()
      .toLowerCase(),
  };
}

function normalizeImportedResources(records) {
  return records.map((record, index) =>
    normalizeImportedResource(record, index),
  );
}

function buildImportPreview(resources) {
  const totalSpend = resources.reduce(
    (sum, resource) => sum + resource.monthlyCost,
    0,
  );
  const totalSavings = resources.reduce(
    (sum, resource) => sum + resource.estimatedMonthlySavings,
    0,
  );

  return {
    resourceCount: resources.length,
    totalSpend: Math.round(totalSpend),
    totalSavings: Math.round(totalSavings),
    topService: resources[0]?.service || "N/A",
  };
}

function getSampleCsvTemplate() {
  return TEMPLATE_ROWS.map((row) => row.join(",")).join("\n");
}

export {
  buildImportPreview,
  COLUMN_MAPPING_GUIDE,
  getSampleCsvTemplate,
  normalizeImportedResources,
  parseCsvText,
};
