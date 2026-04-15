/**
 * Workaround for Next.js 16.2.3 bug:
 * "Expected workStore to be initialized" during /_global-error prerendering.
 *
 * Bug: Multiple server-request helper functions (params, pathname, search-params)
 * throw an InvariantError when workAsyncStorage.getStore() returns null. This happens
 * during static prerendering of special internal pages like /_global-error and
 * /_not-found, where Next.js does not initialize the workStore before calling the
 * metadata generation pipeline.
 *
 * Fix: Two-pronged approach:
 *   1. Patch the source JS files in server/request/ (used by webpack for user code)
 *   2. Patch the pre-compiled bundles in compiled/next-server/ (used directly by
 *      Next.js static generation worker — these bypass webpack entirely)
 *
 * Both the CJS and ESM builds are patched because Turbopack uses the ESM
 * version while Node.js uses the CJS version.
 *
 * Remove this script once the upstream Next.js bug is fixed.
 */

const fs = require("fs");
const path = require("path");

const SENTINEL = "// PATCHED: workStore null-guard";
const MINIFIED_SENTINEL = "/*PATCHED:E1068*/";

// ─── Part 1: Source files (used by webpack for user code) ────────────────────

// Each entry: [cjsFile, esmFile, fallbackReturnValue]
const SOURCE_FILES = [
  [
    path.join(__dirname, "../node_modules/next/dist/server/request/params.js"),
    path.join(__dirname, "../node_modules/next/dist/esm/server/request/params.js"),
    "underlyingParams || {}",
  ],
  [
    path.join(__dirname, "../node_modules/next/dist/server/request/pathname.js"),
    path.join(__dirname, "../node_modules/next/dist/esm/server/request/pathname.js"),
    "underlyingPathname || ''",
  ],
  [
    path.join(__dirname, "../node_modules/next/dist/server/request/search-params.js"),
    path.join(__dirname, "../node_modules/next/dist/esm/server/request/search-params.js"),
    "underlyingSearchParams || {}",
  ],
];

function makeCjsThrow() {
  return (
    `    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();\n` +
    `    if (!workStore) {\n` +
    `        throw Object.defineProperty(new _invarianterror.InvariantError('Expected workStore to be initialized'), "__NEXT_ERROR_CODE", {\n` +
    `            value: "E1068",\n` +
    `            enumerable: false,\n` +
    `            configurable: true\n` +
    `        });\n` +
    `    }`
  );
}

function makeEsmThrow() {
  return (
    `    const workStore = workAsyncStorage.getStore();\n` +
    `    if (!workStore) {\n` +
    `        throw Object.defineProperty(new InvariantError('Expected workStore to be initialized'), "__NEXT_ERROR_CODE", {\n` +
    `            value: "E1068",\n` +
    `            enumerable: false,\n` +
    `            configurable: true\n` +
    `        });\n` +
    `    }`
  );
}

function buildCjsReplacement(fallback) {
  return (
    `    ${SENTINEL}\n` +
    `    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();\n` +
    `    if (!workStore) {\n` +
    `        // Next.js 16.2.3 bug: workStore not initialized during /_global-error prerender.\n` +
    `        // Return safe fallback — error boundary pages do not use these values.\n` +
    `        return ${fallback};\n` +
    `    }`
  );
}

function buildEsmReplacement(fallback) {
  return (
    `    ${SENTINEL}\n` +
    `    const workStore = workAsyncStorage.getStore();\n` +
    `    if (!workStore) {\n` +
    `        // Next.js 16.2.3 bug: workStore not initialized during /_global-error prerender.\n` +
    `        // Return safe fallback — error boundary pages do not use these values.\n` +
    `        return ${fallback};\n` +
    `    }`
  );
}

for (const [cjsPath, esmPath, fallback] of SOURCE_FILES) {
  for (const filePath of [cjsPath, esmPath]) {
    if (!fs.existsSync(filePath)) {
      console.warn(`[patch-next] ${filePath} not found, skipping.`);
      continue;
    }

    let content = fs.readFileSync(filePath, "utf8");

    if (content.includes(SENTINEL)) {
      console.log(`[patch-next] Already patched: ${path.basename(filePath)}`);
      continue;
    }

    const isCJS = content.includes("_workasyncstorageexternal.workAsyncStorage");
    const throwPattern = isCJS ? makeCjsThrow() : makeEsmThrow();
    const replacement = isCJS
      ? buildCjsReplacement(fallback)
      : buildEsmReplacement(fallback);

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
}

// ─── Part 1b: resolve-metadata.js (uses different fallback — avoids React deps) ─

const RESOLVE_METADATA_FILES = [
  {
    filePath: path.join(__dirname, "../node_modules/next/dist/lib/metadata/resolve-metadata.js"),
    throwPattern: makeCjsThrow(),
    replacement: buildCjsReplacement("(0, _defaultmetadata.createDefaultMetadata)()"),
  },
  {
    filePath: path.join(__dirname, "../node_modules/next/dist/esm/lib/metadata/resolve-metadata.js"),
    throwPattern: makeEsmThrow(),
    replacement: buildEsmReplacement("createDefaultMetadata()"),
  },
];

for (const { filePath, throwPattern, replacement } of RESOLVE_METADATA_FILES) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[patch-next] ${filePath} not found, skipping.`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes(SENTINEL)) {
    console.log(`[patch-next] Already patched: ${path.basename(filePath)}`);
    continue;
  }

  const occurrences = content.split(throwPattern).length - 1;

  if (occurrences === 0) {
    console.warn(
      `[patch-next] Target pattern not found in ${path.basename(filePath)}. Skipping.`
    );
    continue;
  }

  content = content.replaceAll(throwPattern, replacement);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(
    `[patch-next] Patched ${occurrences} occurrence(s) in ${path.basename(filePath)}`
  );
}

// ─── Part 2: Pre-compiled bundles (used directly by static generation worker) ─

// These minified bundles bypass webpack and must be patched directly.
// The minified throw pattern looks like:
//   if(!r)throw Object.defineProperty(new j.z("Expected workStore to be initialized"),"__NEXT_ERROR_CODE",{value:"E1068",enumerable:!1,configurable:!0})
// We replace it with a safe no-op return.

const COMPILED_BUNDLES = [
  "app-route.runtime.prod.js",
  "app-route.runtime.dev.js",
  "app-route-experimental.runtime.prod.js",
  "app-route-experimental.runtime.dev.js",
].map((f) =>
  path.join(__dirname, "../node_modules/next/dist/compiled/next-server", f)
);

// Regex: matches the minified throw block for E1068
// Captures the condition variable name so we can reference it in the replacement
const MINIFIED_THROW_RE =
  /if\((![\w$]+)\)throw Object\.defineProperty\(new [\w$.]+\("Expected workStore to be initialized"\),"__NEXT_ERROR_CODE",\{value:"E1068",enumerable:!1,configurable:!0\}\)/g;

for (const filePath of COMPILED_BUNDLES) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[patch-next] ${filePath} not found, skipping.`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes(MINIFIED_SENTINEL)) {
    console.log(`[patch-next] Already patched: ${path.basename(filePath)}`);
    continue;
  }

  const matches = [...content.matchAll(MINIFIED_THROW_RE)];
  if (matches.length === 0) {
    console.warn(
      `[patch-next] Minified pattern not found in ${path.basename(filePath)}. ` +
        "Next.js version may have changed. Skipping."
    );
    continue;
  }

  // Replace each throw with a safe early return
  content = content.replace(
    MINIFIED_THROW_RE,
    (_match, condition) => `if(${condition})return ${MINIFIED_SENTINEL}{}`
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log(
    `[patch-next] Patched ${matches.length} occurrence(s) in ${path.basename(filePath)} (minified)`
  );
}

// NOTE: Sharing ReactSharedInternals via globalThis was tested but caused
// regressions (/_global-error prerender: "layout router not mounted" E56).
// The root layout's `export const dynamic = "force-dynamic"` is the correct
// fix for user pages on Windows. No further patches are needed here.
