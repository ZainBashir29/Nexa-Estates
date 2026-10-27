import { parseQuery } from "../services/parseQuery.js";
import { heldOutQueries } from "../heldOut.js";
import { testQueries } from "../queries.js";

const queries = process.argv.includes("--held-out") ? heldOutQueries : testQueries;

const norm = (o: object) =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(o).sort(([a], [b]) => a.localeCompare(b)),
    ),
  );

let passed = 0;

for (const [index, { text, expected }] of queries.entries()) {
  let result: Awaited<ReturnType<typeof parseQuery>> | undefined;
  let thrownError: unknown;

  try {
    result = await parseQuery(text);
  } catch (error) {
    thrownError = error;
  }

  if (index < queries.length - 1) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
  }

  const actual = result?.ok === true ? result.query : undefined;
  const matches = actual !== undefined && norm(actual) === norm(expected);

  if (matches) {
    passed++;
    console.log(`PASS: ${text}`);
    continue;
  }

  console.log(`FAIL: ${text}`);
  console.log(`  Expected: ${JSON.stringify(expected)}`);

  if (result?.ok === false) {
    const error = "error" in result ? result.error : result.errors;
    console.log(`  Error: ${JSON.stringify(error)}`);
    console.log(`  Got: ${JSON.stringify(error)}`);
  } else if (thrownError !== undefined) {
    console.log(`  Error: ${String(thrownError)}`);
    console.log(`  Got: ${String(thrownError)}`);
  } else {
    console.log(`  Got: ${JSON.stringify(actual)}`);
  }
}

console.log(`Score: ${passed}/${queries.length}`);
