import dotenv from "dotenv";
import assert from "assert";
import { Server } from "http";
// Set NODE_ENV to test so db.ts initializes an in-memory database
const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

dotenv.config();

async function runDbUnitTests(initDb: any, dbRun: any, dbGet: any, dbAll: any) {
  console.log("\n🧪 Running Database Unit Tests...");

  // 1. Initialize DB
  await initDb();
  console.log("  - Database initialized successfully");

  // 2. Test Insert (dbRun)
  const insertResult = await dbRun(
    "INSERT INTO startups (name, idea, analysis) VALUES (?, ?, ?)",
    ["Test Startup", "A test startup idea", JSON.stringify({ summary: "Good idea" })]
  );
  assert.ok(insertResult.lastInsertRowid > 0, "Insert should return a valid row ID");
  assert.strictEqual(insertResult.changes, 1, "Should have affected 1 row");
  const startupId = insertResult.lastInsertRowid;
  console.log(`  - Inserted test startup with ID: ${startupId}`);

  // 3. Test Get (dbGet)
  const startup = await dbGet("SELECT * FROM startups WHERE id = ?", [startupId]);
  assert.ok(startup, "Should retrieve the inserted startup");
  assert.strictEqual(startup.name, "Test Startup", "Startup name should match");
  assert.strictEqual(startup.idea, "A test startup idea", "Startup idea should match");
  console.log("  - Retrieved startup successfully and matched fields");

  // 4. Test All (dbAll)
  const allStartups = await dbAll("SELECT * FROM startups");
  assert.strictEqual(allStartups.length, 1, "Should return exactly 1 startup");
  assert.strictEqual(allStartups[0].id, startupId, "Startup ID in list should match");
  console.log("  - Fetched all startups successfully");

  // 5. Test Update (dbRun)
  const updateResult = await dbRun("UPDATE startups SET logo_url = ? WHERE id = ?", ["http://logo.url", startupId]);
  assert.strictEqual(updateResult.changes, 1, "Should update 1 row");
  const updatedStartup = await dbGet("SELECT logo_url FROM startups WHERE id = ?", [startupId]);
  assert.strictEqual(updatedStartup.logo_url, "http://logo.url", "Logo URL should be updated");
  console.log("  - Updated startup successfully");

  // 6. Test Delete (dbRun)
  const deleteResult = await dbRun("DELETE FROM startups WHERE id = ?", [startupId]);
  assert.strictEqual(deleteResult.changes, 1, "Should delete 1 row");
  const deletedStartup = await dbGet("SELECT * FROM startups WHERE id = ?", [startupId]);
  assert.strictEqual(deletedStartup, undefined, "Startup should no longer exist");
  console.log("  - Deleted startup successfully");

  console.log("✅ Database Unit Tests Passed!");
}

async function runApiIntegrationTests(app: any, initDb: any, dbRun: any, dbGet: any, dbAll: any) {
  console.log("\n🧪 Running API Integration Tests...");
  let server: Server | null = null;

  try {
    // Start Express server
    server = app.listen(PORT, () => {
      console.log(`  - Test server listening on ${BASE_URL}`);
    });

    // 1. Prepare test database state
    await initDb();
    const insertResult = await dbRun(
      "INSERT INTO startups (name, idea, analysis) VALUES (?, ?, ?)",
      ["Ventura Test", "AI strategist", JSON.stringify({ summary: "Viable" })]
    );
    const testId = insertResult.lastInsertRowid;

    // 2. Test GET /api/history
    console.log("  - Testing GET /api/history");
    const historyRes = await fetch(`${BASE_URL}/api/history`);
    assert.strictEqual(historyRes.status, 200, "History route should return 200");
    const historyData = (await historyRes.json()) as any[];
    assert.ok(Array.isArray(historyData), "History response should be an array");
    assert.ok(historyData.length >= 1, "History list should contain at least 1 item");
    assert.strictEqual(historyData[0].name, "Ventura Test", "First startup name should match");

    // 3. Test POST /api/generate-logo
    console.log("  - Testing POST /api/generate-logo");
    const logoRes = await fetch(`${BASE_URL}/api/generate-logo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupId: testId, name: "Ventura Test" })
    });
    assert.strictEqual(logoRes.status, 200, "Logo generation should return 200");
    const logoData = (await logoRes.json()) as any;
    assert.ok(logoData.imageUrl, "Should return an image URL");
    assert.ok(logoData.imageUrl.startsWith("data:image/svg+xml"), "Should be a data SVG URI");

    // Verify database was updated with the logo URL
    const dbStartupWithLogo = await dbGet("SELECT logo_url FROM startups WHERE id = ?", [testId]);
    assert.strictEqual(dbStartupWithLogo.logo_url, logoData.imageUrl, "DB logo_url should be updated");

    // 4. Test POST /api/generate-ui
    console.log("  - Testing POST /api/generate-ui");
    const uiRes = await fetch(`${BASE_URL}/api/generate-ui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupId: testId, name: "Ventura Test", idea: "AI strategist" })
    });
    assert.strictEqual(uiRes.status, 200, "UI generation should return 200");
    const uiData = (await uiRes.json()) as any;
    assert.ok(uiData.html, "Should return generated HTML code");
    assert.ok(uiData.html.includes("<!DOCTYPE html>"), "Should be a complete HTML page");

    // Verify database was updated with the generated HTML
    const dbStartupWithHtml = await dbGet("SELECT website_html FROM startups WHERE id = ?", [testId]);
    assert.strictEqual(dbStartupWithHtml.website_html, uiData.html, "DB website_html should be updated");

    // 5. Test GET /api/website-history/:startupId
    console.log("  - Testing GET /api/website-history/:startupId");
    const webHistoryRes = await fetch(`${BASE_URL}/api/website-history/${testId}`);
    assert.strictEqual(webHistoryRes.status, 200, "Website history should return 200");
    const webHistoryData = (await webHistoryRes.json()) as any[];
    assert.ok(Array.isArray(webHistoryData), "Website history should be an array");
    assert.strictEqual(webHistoryData.length, 1, "Should have 1 entry in history");
    assert.strictEqual(webHistoryData[0].html, uiData.html, "History HTML should match generated HTML");

    // 6. Test DELETE /api/history/:id
    console.log("  - Testing DELETE /api/history/:id");
    const deleteRes = await fetch(`${BASE_URL}/api/history/${testId}`, { method: "DELETE" });
    assert.strictEqual(deleteRes.status, 200, "Delete startup should return 200");
    const deleteData = (await deleteRes.json()) as any;
    assert.deepStrictEqual(deleteData, { success: true }, "Should return success true");

    // Verify deletion in DB
    const dbStartupDeleted = await dbGet("SELECT * FROM startups WHERE id = ?", [testId]);
    assert.strictEqual(dbStartupDeleted, undefined, "Startup should be deleted from DB");

    console.log("✅ API Integration Tests Passed!");
  } finally {
    if (server) {
      server.close(() => {
        console.log("  - Test server shut down");
      });
    }
  }
}

async function main() {
  console.log("🚀 Starting Ventura Startup Analyzer Test Suite");
  
  // Dynamically import database and app after process.env.NODE_ENV is set to "test"
  const { initDb, dbRun, dbGet, dbAll } = await import("../server/db.js");
  const { default: app } = await import("../server.ts");

  try {
    await runDbUnitTests(initDb, dbRun, dbGet, dbAll);
    await runApiIntegrationTests(app, initDb, dbRun, dbGet, dbAll);
    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉\n");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ TEST SUITE FAILED:");
    console.error(error);
    process.exit(1);
  }
}

main();
