USE cloud_cost_intelligence;

INSERT INTO accounts
    (id, name, industry, monthly_budget)
VALUES
    (1, 'Northstar SaaS', 'B2B SaaS', 15000.00)
ON DUPLICATE KEY
UPDATE
  name = VALUES
(name),
  industry = VALUES
(industry),
  monthly_budget = VALUES
(monthly_budget);

INSERT INTO resources
    (
    id,
    account_id,
    service,
    resource_name,
    environment,
    region,
    status,
    utilization_pct,
    monthly_cost,
    owner_team,
    last_used_days,
    recommendation_type,
    recommendation_title,
    recommendation_detail,
    estimated_monthly_savings,
    priority
    )
VALUES
    (1, 1, 'EC2', 'api-worker-3', 'prod', 'us-east-1', 'active', 12.00, 2480.00, 'Platform', 8, 'rightsize', 'Rightsize the API worker fleet', 'The workload is consistently under 15% utilization, so the instance family can be reduced without affecting peak traffic.', 930.00, 'high'),
    (2, 1, 'RDS', 'customer-db', 'prod', 'us-east-1', 'active', 82.00, 1750.00, 'Data', 0, 'commitment', 'Buy a reserved instance for the customer database', 'Usage is stable and predictable, making this a strong candidate for a committed capacity discount.', 420.00, 'high'),
    (3, 1, 'RDS', 'staging-db', 'staging', 'us-east-1', 'idle', 4.00, 640.00, 'Data', 21, 'schedule', 'Schedule staging database shutdown windows', 'The staging database is mostly idle outside working hours and can be powered down nightly and on weekends.', 380.00, 'high'),
    (4, 1, 'EBS', 'unattached-volume-12', 'dev', 'us-west-2', 'available', 0.00, 128.00, 'Platform', 31, 'cleanup', 'Delete unattached storage', 'This volume is detached and has not been touched in over a month. Removing it stops avoidable block storage charges.', 128.00, 'medium'),
    (5, 1, 'NAT Gateway', 'shared-nat-1', 'prod', 'us-east-1', 'active', 91.00, 910.00, 'Platform', 0, 'network-optimization', 'Reduce NAT data transfer', 'Route S3 and CloudWatch traffic through VPC endpoints to cut avoidable egress and NAT processing charges.', 240.00, 'medium'),
    (6, 1, 'ElastiCache', 'session-cache', 'prod', 'us-east-1', 'active', 69.00, 790.00, 'App', 1, 'rightsize', 'Reduce cache node size off-peak', 'The cache is healthy but has headroom. A smaller node class plus a schedule can preserve latency while lowering spend.', 210.00, 'medium'),
    (7, 1, 'EC2', 'batch-node-1', 'staging', 'us-west-2', 'active', 7.00, 1180.00, 'Analytics', 12, 'schedule', 'Scale batch compute to zero after runs', 'Batch traffic is sporadic and the node spends most of the day idle. Schedule start/stop windows around the pipeline.', 560.00, 'high'),
    (8, 1, 'Snapshots', 'monthly-backup-set', 'prod', 'us-east-1', 'active', 0.00, 260.00, 'Platform', 45, 'cleanup', 'Archive or delete stale snapshots', 'The backup set is older than retention policy and can be compacted into cheaper archival storage or removed.', 140.00, 'low'),
    (9, 1, 'OpenSearch', 'search-prod', 'prod', 'us-east-1', 'active', 74.00, 2240.00, 'Search', 0, 'commitment', 'Commit steady search capacity', 'Search traffic is steady enough to benefit from reserved capacity pricing for the core cluster.', 520.00, 'high'),
    (10, 1, 'EKS', 'qa-node-group', 'qa', 'us-west-2', 'active', 14.00, 1420.00, 'QA', 10, 'rightsize', 'Reduce the QA node group footprint', 'The QA cluster is oversized for its current test load and can shrink without affecting deployments.', 610.00, 'high')
ON DUPLICATE KEY
UPDATE
  account_id = VALUES
(account_id),
  service = VALUES
(service),
  resource_name = VALUES
(resource_name),
  environment = VALUES
(environment),
  region = VALUES
(region),
  status = VALUES
(status),
  utilization_pct = VALUES
(utilization_pct),
  monthly_cost = VALUES
(monthly_cost),
  owner_team = VALUES
(owner_team),
  last_used_days = VALUES
(last_used_days),
  recommendation_type = VALUES
(recommendation_type),
  recommendation_title = VALUES
(recommendation_title),
  recommendation_detail = VALUES
(recommendation_detail),
  estimated_monthly_savings = VALUES
(estimated_monthly_savings),
  priority = VALUES
(priority);
