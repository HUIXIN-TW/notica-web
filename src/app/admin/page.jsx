"use client";

import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import Button from "@components/button/Button";
import formatTimestamp from "@utils/format-timestamp";
import formatSyncLog from "@utils/format-sync-log";
import styles from "./admin.module.css";
import { useAuth } from "@auth/AuthContext";
import env from "@config/env";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

import MigrationDashboard from "./migration/migration.jsx";

export default function Admin() {
  const { user, loading } = useAuth();
  const [userCounts, setUserCounts] = useState(null);
  const [syncCounts, setSyncCounts] = useState(null);
  const [syncDailyCounts, setSyncDailyCounts] = useState(null);
  const [latestSyncLogs, setLatestSyncLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [migrationRefreshKey, setMigrationRefreshKey] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [error, setError] = useState(null);

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = env.API_BASE_URL;
      if (!baseUrl) throw new Error("Missing API base URL");
      const [uRes, sRes, lslRes, luRes] = await Promise.all([
        fetch(`${baseUrl}/admin/user-metrics`, {
          cache: "no-store",
          credentials: "include",
        }),
        fetch(`${baseUrl}/admin/sync-metrics`, {
          cache: "no-store",
          credentials: "include",
        }),
        fetch(`${baseUrl}/admin/list-sync-log`, {
          cache: "no-store",
          credentials: "include",
        }),
        fetch(`${baseUrl}/admin/list-user`, {
          cache: "no-store",
          credentials: "include",
        }),
      ]);
      if (!uRes.ok) throw new Error(`user-metrics ${uRes.status}`);
      if (!sRes.ok) throw new Error(`sync-metrics ${sRes.status}`);
      if (!lslRes.ok) throw new Error(`list-sync-log ${lslRes.status}`);
      if (!luRes.ok) throw new Error(`list-user ${luRes.status}`);

      setUserCounts(await uRes.json());
      const { totalCount, dailyCounts } = await sRes.json();
      setSyncCounts(Number(totalCount) || 0);
      setSyncDailyCounts(dailyCounts || []);
      const latestSyncLogs = await lslRes.json();
      setLatestSyncLogs(latestSyncLogs?.items || []);
      const allUsers = await luRes.json();
      setUsers(allUsers?.users || []);
    } catch (e) {
      setError(e?.message || "refresh failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      fetchDashboardData();
    }
  }, [loading, user]);

  const usersChart = useMemo(() => {
    const labels = (userCounts ?? []).map((d) => d.createdAt);
    const counts = (userCounts ?? []).map((d) => d.count ?? 0);

    return {
      data: {
        labels,
        datasets: [
          {
            label: "New users per day",
            data: counts,
            fill: true,
            borderColor: "rgba(99, 102, 241, 1)", // indigo-500
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)"); // top
              gradient.addColorStop(1, "rgba(99, 102, 241, 0)"); // bottom
              return gradient;
            },
            pointBackgroundColor: "#6366F1",
            borderWidth: 2,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1E1E1E",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { color: "#555", precision: 0 },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#777", autoSkip: true, maxTicksLimit: 14 },
          },
        },
      },
    };
  }, [userCounts]);

  const syncDailyCountsChart = useMemo(() => {
    const labels = (syncDailyCounts ?? []).map((d) => d.date);
    const counts = (syncDailyCounts ?? []).map((d) => d.count ?? 0);

    return {
      data: {
        labels,
        datasets: [
          {
            label: "Sync operations per day",
            data: counts,
            fill: true,
            borderColor: "rgba(99, 102, 241, 1)", // indigo-500
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)"); // top
              gradient.addColorStop(1, "rgba(99, 102, 241, 0)"); // bottom
              return gradient;
            },
            pointBackgroundColor: "#6366F1",
            borderWidth: 2,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1E1E1E",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { color: "#555", precision: 0 },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#777", autoSkip: true, maxTicksLimit: 14 },
          },
        },
      },
    };
  }, [syncDailyCounts]);

  const toggleLogExpansion = (key) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const shortUuid = (uuid) => {
    if (!uuid) return "—";
    const str = String(uuid);
    const firstSegment = str.split("-")[0];
    return firstSegment || str.slice(0, 8);
  };

  const refreshAll = () => {
    setMigrationRefreshKey((k) => (k ?? 0) + 1);
    fetchDashboardData();
  };

  if (loading) return <div>Loading session...</div>;
  if (!user || user.role !== "admin") {
    return <div>Admin access only.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <Button
          text={loading ? "Refreshing…" : "Refresh"}
          onClick={refreshAll}
          disabled={loading}
        />
      </div>

      {error && (
        <div className={styles.section}>
          <div className={styles.card}>Error: {error}</div>
        </div>
      )}

      <div className={styles.grid}>
        <section className={`${styles.section} ${styles.card}`}>
          <div className={styles.chartWrap_migration}>
            <MigrationDashboard refreshKey={migrationRefreshKey} />
          </div>
        </section>
        <section className={`${styles.section} ${styles.card}`}>
          <h2>Total User Count</h2>
          <div className={styles.syncNumber}>
            {Array.isArray(users) ? users.length : "—"}
          </div>
          <div className={styles.syncLabel}>
            All users currently in the system
          </div>
        </section>
        <section className={`${styles.section} ${styles.card}`}>
          <h2>New User Trend (last 14 days)</h2>
          <div className={styles.chartWrap}>
            {userCounts ? (
              <Line data={usersChart.data} options={usersChart.options} />
            ) : (
              <div>No data</div>
            )}
          </div>
        </section>
        <section className={`${styles.section} ${styles.card}`}>
          <h2>User List</h2>
          <div className={styles.logsTableWrap}>
            {loading && !users.length ? (
              <div>Loading…</div>
            ) : users.length ? (
              <table className={styles.logsTable}>
                <thead>
                  <tr>
                    <th>UUID</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Last Login</th>
                    <th>Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uuid}>
                      <td className={styles.mono} title={user.uuid}>
                        {shortUuid(user.uuid)}
                      </td>
                      <td>
                        <span className={styles.triggerBadge}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className={styles.timestampCell}>
                        {formatTimestamp(user.createdAtMs || user.createdAt)}
                      </td>
                      <td className={styles.timestampCell}>
                        {formatTimestamp(
                          user.lastLoginAtMs || user.lastLoginAt,
                        )}
                      </td>
                      <td className={`${styles.mono} ${styles.logCell}`}>
                        <div className={styles.logCellContent}>
                          <div
                            className={
                              expandedLogs.has(`user-${user.uuid}-lastSyncLog`)
                                ? styles.logTextExpanded
                                : styles.logTextCollapsed
                            }
                          >
                            {formatSyncLog(user.lastSyncLog, {
                              expanded: expandedLogs.has(
                                `user-${user.uuid}-lastSyncLog`,
                              ),
                            })}
                          </div>
                          <button
                            type="button"
                            className={styles.logToggle}
                            onClick={() =>
                              toggleLogExpansion(
                                `user-${user.uuid}-lastSyncLog`,
                              )
                            }
                          >
                            {expandedLogs.has(`user-${user.uuid}-lastSyncLog`)
                              ? "Hide"
                              : "Show"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No users found</div>
            )}
          </div>
        </section>
        <section className={`${styles.section} ${styles.card}`}>
          <h2>Total Sync Count (last 7 days)</h2>
          <div className={styles.syncNumber}>
            {syncCounts !== null ? syncCounts : "—"}
          </div>
          <div className={styles.syncLabel}>
            Total sync operations in the last 7 days (168 hours)
          </div>
        </section>
        <section className={`${styles.section} ${styles.card}`}>
          <h2>Sync Count (last 7 days)</h2>
          <div className={styles.chartWrap}>
            {syncDailyCounts ? (
              <Line
                data={syncDailyCountsChart.data}
                options={syncDailyCountsChart.options}
              />
            ) : (
              <div>No data</div>
            )}
          </div>
        </section>
        <section className={`${styles.section} ${styles.card}`}>
          <h2>Latest Sync Log List (20)</h2>
          <div className={styles.logsTableWrap}>
            {loading && !latestSyncLogs.length ? (
              <div>Loading…</div>
            ) : latestSyncLogs.length ? (
              <table className={styles.logsTable}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Trigger</th>
                    <th>UUID</th>
                    <th>Log</th>
                  </tr>
                </thead>
                <tbody>
                  {latestSyncLogs.map((item, idx) => (
                    <tr key={`${item.uuid || "log"}-${item.timestamp || idx}`}>
                      <td className={styles.timestampCell}>
                        {formatTimestamp(item.timestamp)}
                      </td>
                      <td>
                        <span className={styles.triggerBadge}>
                          {item.trigger_by || "—"}
                        </span>
                      </td>
                      <td className={styles.mono} title={item.uuid || "—"}>
                        {shortUuid(item.uuid)}
                      </td>
                      <td className={`${styles.mono} ${styles.logCell}`}>
                        <div className={styles.logCellContent}>
                          <div
                            className={
                              expandedLogs.has(
                                `${item.uuid || "log"}-${item.timestamp || idx}`,
                              )
                                ? styles.logTextExpanded
                                : styles.logTextCollapsed
                            }
                          >
                            {formatSyncLog(item.log, {
                              expanded: expandedLogs.has(
                                `${item.uuid || "log"}-${item.timestamp || idx}`,
                              ),
                            })}
                          </div>
                          <button
                            type="button"
                            className={styles.logToggle}
                            onClick={() =>
                              toggleLogExpansion(
                                `${item.uuid || "log"}-${
                                  item.timestamp || idx
                                }`,
                              )
                            }
                          >
                            {expandedLogs.has(
                              `${item.uuid || "log"}-${item.timestamp || idx}`,
                            )
                              ? "Hide"
                              : "Show"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No sync records found</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
