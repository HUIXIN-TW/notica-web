import "server-only";
import { ddb } from "@utils/server/db-client";
import { ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.DYNAMODB_SYNC_LOGS_TABLE;

export async function getSyncCounts() {
  let total = 0;
  let ExclusiveStartKey;

  do {
    const res = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        Select: "COUNT",
        ExclusiveStartKey,
      }),
    );

    total += res.Count || 0;
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return { totalCount: total };
}

export async function getDailySyncCountsLastNDays(days = 7) {
  const today = new Date();
  const results = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "dateTimestampIndex",
        KeyConditionExpression: "#d = :date",
        ExpressionAttributeNames: { "#d": "date" },
        ExpressionAttributeValues: { ":date": dateStr },
        Select: "COUNT",
      }),
    );

    results.push({
      date: dateStr,
      count: res.Count || 0,
    });
  }
  return results;
}

export async function getLatestSyncLogs(limit = 20) {
  const today = new Date();
  const items = [];
  const maxDaysToScan = 30;

  for (let i = 0; items.length < limit && i < maxDaysToScan; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

    let ExclusiveStartKey;

    // Paginate through results for this date til we fill the limit
    do {
      const res = await ddb.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "dateTimestampIndex",
          KeyConditionExpression: "#d = :date",
          ExpressionAttributeNames: { "#d": "date" },
          ExpressionAttributeValues: { ":date": dateStr },
          ScanIndexForward: false, // newest first
          Limit: limit - items.length,
          ExclusiveStartKey,
        }),
      );

      items.push(...(res.Items || []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (items.length < limit && ExclusiveStartKey);
  }

  // Ensure final list is globally sorted across days
  items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  return items.slice(0, limit);
}
