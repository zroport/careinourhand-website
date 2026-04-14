/**
 * Workaround for Next.js 16.2.3 bug:
 * "Expected workStore to be initialized" during /_global-error prerendering.
 *
 * Bug: createServerParamsForServerSegment (and related functions) throw an
 * InvariantError when workAsyncStorage.getStore() returns null. This happens
 * during static prerendering of special internal pages like /_global-error,
 * where Next.js does not initialize the workStore before calling the metadata
 * generation pipeline.
 *
 * Fix: gracefully return underlyingParams when workStore is null, rather than
 * throwing. This is safe for error pages which have no dynamic route segments.
 *
 * Both the CJS and ESM builds are patched because Turbopack uses the ESM
 * version while Node.js uses the CJS version.
 *
 * Remove this script once the upstream Next.js bug is fixed.
 */

const fs = require("fs");
const path = require("path");

const FILES_TO_PATCH = [
  path.join(__dirname, "../node_modules/next/dist/server/request/params.js"),
  path.join(__dirname, "../node_modules/next/dist/esm/server/request/params.js"),
];

// The exact throw block to find (CJS style)
const CJS_THROW =
  `    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();\n` +
  `    if (!workStore) {\n` +
  `        throw Object.defineProperty(new _invarianterror.InvariantError('Expected workStore to be initialized'), "__NEXT_ERROR_CODE", {\n` +
  `            value: "E1068",\n` +
  `            enumerable: false,\n` +
  `            configurable: true\n` +
  `        });\n` +
  `    }`;

// ESM style (uses named imports instead of namespace)
const ESM_THROW =
  `    const workStore = workAsyncStorage.getStore();\n` +
  `    if (!workStore) {\n` +
  `        throw Object.defineProperty(new InvariantError('Expected workStore to be initialized'), "__NEXT_ERROR_CODE", {\n` +
  `            value: "E1068",\n` +
  `            enumerable: false,\n` +
  `            configurable: true\n` +
  `        });\n` +
  `    }`;

const SENTINEL = "// PATCHED: workStore null-guard";

function buildReplacement(storeExpr, prefix) {
  return (
    `    ${SENTINEL}\n` +
    `    const workStore = ${storeExpr};\n` +
    `    if (!workStore) {\n` +
    `        // Next.js 16.2.3 bug: workStore not initialized during /_global-error prerender.\n` +
    `        // Return underlyingParams directly as safe fallback for error/not-found pages.\n` +
    `        return underlyingParams || {};\n` +
    `    }`
  );
}

const CJS_REPLACEMENT = buildReplacement(
  "_workasyncstorageexternal.workAsyncStorage.getStore()"
);
const ESM_REPLACEMENT = buildReplacement("workAsyncStorage.getStore()");

for (const filePath of FILES_TO_PATCH) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[patch-next] ${filePath} not found, skipping.`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes(SENTINEL)) {
    console.log(`[patch-next] Already patched: ${path.basename(filePath)}`);
    continue;
  }

  // Determine if CJS or ESM
  const isCJS = content.includes("_workasyncstorageexternal.workAsyncStorage");
  const throwPattern = isCJS ? CJS_THROW : ESM_THROW;
  const replacement = isCJS ? CJS_REPLACEMENT : ESM_REPLACEMENT;

  const occurrences = content.split(throwPattern).length - 1;

  if (occurrences === 0) {
    console.warn(
      `[patch-next] Target pattern not found in ${path.basename(filePath)}. ` +
        "Next.js version may have changed. Skipping."
    );
    continue;
  }

  content = content.replaceAll(throwPattern, replacement);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(
    `[patch-next] Patched ${occurrences} occurrence(s) in ${path.basename(filePath)} (${isCJS ? "CJS" : "ESM"})`
  );
}
