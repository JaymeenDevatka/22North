function toCurrency(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function priorityFromSavings(savings) {
  if (savings >= 750) {
    return "High";
  }

  if (savings >= 250) {
    return "Medium";
  }

  return "Low";
}

function confidenceByType(type) {
  const map = {
    rightsize: 91,
    schedule: 95,
    cleanup: 99,
    commitment: 84,
    "network-optimization": 78,
  };

  return map[type] || 80;
}

function effortByType(type) {
  const map = {
    rightsize: "Low",
    schedule: "Low",
    cleanup: "Very low",
    commitment: "Medium",
    "network-optimization": "Medium",
  };

  return map[type] || "Medium";
}

function actionByType(type) {
  const map = {
    rightsize:
      "Resize the instance family and validate with a 48-hour watch window.",
    schedule:
      "Add start/stop automation and keep only daytime capacity active.",
    cleanup:
      "Delete or archive the resource after confirming no dependency remains.",
    commitment:
      "Purchase reserved capacity once usage is verified against the last 30 days.",
    "network-optimization":
      "Shift recurring traffic onto private endpoints and reduce gateway throughput.",
  };

  return map[type] || "Review the resource with the owning team.";
}

function normalizeImportedResource(record, index) {
  const toNumber = (value, fallback = 0) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const pickValue = (...keys) => {
    for (const key of keys) {
      const value = record[key];
      if (value !== undefined && String(value).trim() !== "") {
        return value;
      }
    }

    return "";
  };

  return {
    id: toNumber(pickValue("id", "resource_id", "resourceId"), index + 1),
    service: pickValue("service") || "Unknown",
    resourceName:
      pickValue("resource_name", "resourceName", "name") ||
      `resource-${index + 1}`,
    environment: pickValue("environment", "env") || "unknown",
    region: pickValue("region", "location") || "unknown",
    status: pickValue("status") || "active",
    utilizationPct: toNumber(
      pickValue("utilization_pct", "utilizationPct", "utilization"),
    ),
    monthlyCost: toNumber(
      pickValue("monthly_cost", "monthlyCost", "cost", "monthly_spend"),
    ),
    ownerTeam: pickValue("owner_team", "ownerTeam", "team") || "Unassigned",
    lastUsedDays: toNumber(
      pickValue("last_used_days", "lastUsedDays", "days_unused"),
    ),
    recommendationType:
      pickValue("recommendation_type", "recommendationType", "type") ||
      "rightsize",
    recommendationTitle:
      pickValue("recommendation_title", "recommendationTitle", "title") ||
      "Review the resource",
    recommendationDetail:
      pickValue("recommendation_detail", "recommendationDetail", "detail") ||
      "The imported row does not include a detailed recommendation, so a generic review was created.",
    estimatedMonthlySavings: toNumber(
      pickValue(
        "estimated_monthly_savings",
        "estimatedMonthlySavings",
        "savings",
        "expected_savings",
      ),
    ),
    priority: String(pickValue("priority", "severity") || "medium")
      .trim()
      .toLowerCase(),
  };
}

function buildServiceBreakdown(resources) {
  const grouped = new Map();

  for (const resource of resources) {
    const current = grouped.get(resource.service) || {
      service: resource.service,
      spend: 0,
      savings: 0,
      count: 0,
    };
    current.spend += resource.monthlyCost;
    current.savings += resource.estimatedMonthlySavings;
    current.count += 1;
    grouped.set(resource.service, current);
  }

  return Array.from(grouped.values())
    .map((item) => ({
      ...item,
      spend: toCurrency(item.spend),
      savings: toCurrency(item.savings),
      savingsRate: item.spend
        ? Math.round((item.savings / item.spend) * 100)
        : 0,
    }))
    .sort((left, right) => right.spend - left.spend);
}

function buildRecommendations(resources) {
  return resources
    .map((resource) => ({
      id: resource.id,
      service: resource.service,
      resourceName: resource.resourceName,
      environment: resource.environment,
      region: resource.region,
      ownerTeam: resource.ownerTeam,
      status: resource.status,
      utilizationPct: resource.utilizationPct,
      monthlyCost: toCurrency(resource.monthlyCost),
      estimatedMonthlySavings: toCurrency(resource.estimatedMonthlySavings),
      recommendationType: resource.recommendationType,
      recommendationTitle: resource.recommendationTitle,
      recommendationDetail: resource.recommendationDetail,
      action: actionByType(resource.recommendationType),
      confidence: confidenceByType(resource.recommendationType),
      effort: effortByType(resource.recommendationType),
      priority:
        resource.priority ||
        priorityFromSavings(resource.estimatedMonthlySavings),
      lastUsedDays: resource.lastUsedDays,
    }))
    .sort(
      (left, right) =>
        right.estimatedMonthlySavings - left.estimatedMonthlySavings,
    );
}

function buildSummary(account, resources, recommendations, serviceBreakdown) {
  const monthlySpend = resources.reduce(
    (total, resource) => total + resource.monthlyCost,
    0,
  );
  const projectedSavings = resources.reduce(
    (total, resource) => total + resource.estimatedMonthlySavings,
    0,
  );
  const netAfterOptimization = monthlySpend - projectedSavings;
  const coveragePct = account.monthlyBudget
    ? Math.round((monthlySpend / account.monthlyBudget) * 100)
    : 0;
  const savingsPct = monthlySpend
    ? Math.round((projectedSavings / monthlySpend) * 100)
    : 0;
  const topService = serviceBreakdown[0]?.service || "N/A";
  const highestValueRecommendation = recommendations[0] || null;
  const highPriorityCount = recommendations.filter(
    (item) => item.priority === "High",
  ).length;

  return {
    accountName: account.name,
    monthlyBudget: toCurrency(account.monthlyBudget),
    monthlySpend: toCurrency(monthlySpend),
    projectedSavings: toCurrency(projectedSavings),
    netAfterOptimization: toCurrency(netAfterOptimization),
    coveragePct,
    savingsPct,
    resourceCount: resources.length,
    highPriorityCount,
    topService,
    highestValueRecommendation,
  };
}

function buildDashboard(account, resources, mode) {
  const recommendations = buildRecommendations(resources);
  const serviceBreakdown = buildServiceBreakdown(resources);
  const summary = buildSummary(
    account,
    resources,
    recommendations,
    serviceBreakdown,
  );

  return {
    mode,
    summary,
    serviceBreakdown,
    recommendations,
  };
}

function buildMeta() {
  return {
    customerJourney: [
      {
        title: "Upload data",
        description:
          "Import a CSV billing export, download the starter template, or use bundled sample datasets.",
      },
      {
        title: "Process & analyze",
        description:
          "The insight engine runs cost analysis, waste detection, and priority ranking on every resource.",
      },
      {
        title: "Visualize insights",
        description:
          "Review the dashboard, service breakdown charts, and KPI cards for spend concentration.",
      },
      {
        title: "Save costs",
        description:
          "Act on ranked recommendations, track savings estimates, and review import history in MySQL.",
      },
    ],
    architecture: [
      {
        title: "Upload module (React)",
        description:
          "CSV upload panel with preview, column mapping guide, and template download.",
      },
      {
        title: "Dashboard page (React)",
        description:
          "Real-time spend views, budget coverage, service breakup, and savings KPIs.",
      },
      {
        title: "Recommendations page (React)",
        description:
          "Ranked savings suggestions with filter chips, confidence scores, and review tracking.",
      },
      {
        title: "REST API (Express)",
        description:
          "Node.js API serving dashboard, metadata, imports, and health endpoints.",
      },
      {
        title: "Insight engine",
        description:
          "Cost analyzer, waste detector, and recommendation engine with deterministic scoring.",
      },
      {
        title: "MySQL store",
        description:
          "Accounts, cost data, and import runs with sample-data fallback for reliable demos.",
      },
    ],
    assumptions: [
      "Growing SaaS companies waste 30–35% of cloud spend without proper visibility.",
      "Cloud billing and telemetry are pre-exported as CSV — no live AWS integration required.",
      "Actionable insights matter more than complex ML scoring for the first release.",
      "Savings estimates are directional and should be validated before execution.",
    ],
    apiCatalog: [
      {
        method: "GET",
        path: "/api/health",
        description:
          "Checks API status and whether the backend is using MySQL or bundled sample data.",
      },
      {
        method: "GET",
        path: "/api/dashboard",
        description:
          "Returns spend summaries, service breakdowns, and ranked recommendations.",
      },
      {
        method: "GET",
        path: "/api/resources",
        description:
          "Returns the raw resource inventory used by the intelligence layer.",
      },
      {
        method: "GET",
        path: "/api/meta",
        description:
          "Returns customer journey, architecture, assumptions, and demo narrative data.",
      },
    ],
    demoScript: [
      "Open the dashboard and point out the monthly spend versus projected savings.",
      "Scroll through the ranked recommendations and explain why the top three are high impact.",
      "Show the service breakdown to connect spend concentration with the optimisation plan.",
      "Open the architecture and API sections to explain how the prototype stays simple but extensible.",
    ],
  };
}

module.exports = {
  buildDashboard,
  buildMeta,
  normalizeImportedResource,
};
