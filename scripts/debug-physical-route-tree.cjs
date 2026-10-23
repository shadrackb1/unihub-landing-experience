const fs = require('fs');
const path = require('path');

const root = process.cwd();
const gen = require(path.resolve(root, 'node_modules/@tanstack/router-generator/dist/cjs/index.cjs'));
const Utils = require(path.resolve(root, 'node_modules/@tanstack/router-generator/dist/cjs/utils.cjs'));

console.log('Utils has createTokenRegex:', typeof Utils.createTokenRegex === 'function');
console.log('Utils has sortRouteNodes:', typeof Utils.sortRouteNodes === 'function');
console.log();

const config = gen.getConfig(root);
const routesDir = config.routesDirectory;

console.log('TanStack route generator — resolved config (cwd =', root, ')');
console.log('  routesDirectory         :', routesDir);
console.log('  generatedRouteTree      :', config.generatedRouteTree);
console.log('  target                  :', config.target);
console.log('  indexToken              :', config.indexToken);
console.log('  routeToken              :', config.routeToken);
console.log('  routesDirectory exists  :', fs.existsSync(routesDir));
console.log();

// Replicate the EXACT token-regex objects the Generator constructor builds and passes
// into the physical reader during generatorInternal().
const indexTokenSegmentRegex = Utils.createTokenRegex(config.indexToken, { type: 'segment' });
const routeTokenSegmentRegex = Utils.createTokenRegex(config.routeToken, { type: 'segment' });
console.log('indexTokenSegmentRegex :', indexTokenSegmentRegex);
console.log('routeTokenSegmentRegex :', routeTokenSegmentRegex);
console.log();

// ----------------------------------------------------------------------
// Path 1: virtual reader (the CLI path when src/routes.ts exists).
// ----------------------------------------------------------------------
const throwawayRoutesTs = path.resolve(root, 'src/routes.ts');

// Build the throwaway routes.ts as a single string constant so the inline syntax is exactly
// what we intend, rather than churning through array joins that can mis-render on Windows.
const throwawayRoutesContent = [
  '// @ts-nocheck',
  '// throwaway file used only to exercise the TanStack virtual reader path in this debug script',
  "import { rootRoute } from '@tanstack/react-router';",
  '',
  'export const routes = rootRoute({',
  "  file: '__root.tsx',",
  '  children: [',
  "    { type: 'physical', directory: '.', pathPrefix: '/' },",
  '  ],',
  '});',
  '',
].join('\n');


try {
  fs.writeFileSync(throwawayRoutesTs, throwawayRoutesContent, 'utf8');
  console.log('wrote throwaway src/routes.ts for the virtual reader path (physical subtree)');
  console.log('throwaway routes.ts bytes:', throwawayRoutesContent.length);
} catch (e) {
  console.log('could not write throwaway src/routes.ts:', String(e && (e.code || e.message)).slice(0, 400));
  process.exitCode = 1;
}

const configForVirtual = {
  ...config,
  virtualRouteConfig: 'src/routes.ts',
};

console.log();
console.log('=== Path 1: virtual reader (CLI path when src/routes.ts exists) ===');
const virtualResult = gen.virtualGetRouteNodes(configForVirtual, root, {
  indexTokenSegmentRegex,
  routeTokenSegmentRegex,
});

Promise.resolve(virtualResult)
  .then(actual => {
    console.log('virtualGetRouteNodes resolved OK');
    const keys = Object.keys(actual);
    console.log('returned keys:', keys.join(', '));
    const { rootRouteNode, routeNodes } = actual;
    console.log();
    console.log('rootRouteNode present:', !!rootRouteNode);
    if (rootRouteNode) {
      console.log('  id           :', rootRouteNode.id);
      console.log('  routePath    :', rootRouteNode.routePath);
      console.log('  _fsRouteType :', rootRouteNode._fsRouteType);
      console.log('  variableName :', rootRouteNode.variableName ?? 'n/a');
      console.log('  filePath     :', rootRouteNode.filePath ?? 'n/a');
    }
    console.log();
    console.log('total routeNodes:', routeNodes ? routeNodes.length : 'N/A');
    if (routeNodes && routeNodes.length) {
      console.log();
      console.log('=== virtual reader route list (sorted by routePath) ===');
      const sorted = routeNodes.slice().sort((a, b) => (a.routePath || '').localeCompare(b.routePath));
      sorted.forEach((n, i) => {
        console.log(
          '[' + i + '] ' +
          'routePath=' + (n.routePath ?? 'n/a') +
          '  _fsRouteType=' + (n._fsRouteType ?? 'n/a') +
          '  variableName=' + (n.variableName ?? 'n/a') +
          (n.filePath && n.filePath !== '' ? '  filePath=' + path.basename(n.filePath) : '') +
          (n.id ? '  id=' + n.id : '')
        );
      });
    }
  })
  .catch(err => {
    console.log('virtualGetRouteNodes REJECTED:');
    console.log(String(err && (err.code || err.message || err.stack)).slice(0, 2500));
  })
  .finally(() => {
    // Clean up the throwaway file so we leave the workspace as we found it.
    try { fs.unlinkSync(throwawayRoutesTs); } catch (_) {}
    console.log();
    console.log('cleaned up throwaway src/routes.ts');
  });

// ----------------------------------------------------------------------
// Path 2: physical reader (the CLI path when src/routes.ts does NOT exist).
// ----------------------------------------------------------------------
console.log();
console.log('=== Path 2: physical reader (CLI path when src/routes.ts does NOT exist) ===');

const physicalResult = gen.physicalGetRouteNodes({
  routesDirectory: routesDir,
  routeFilePrefix: config.routeFilePrefix,
  routeFileIgnorePrefix: config.routeFileIgnorePrefix,
  routeFileIgnorePattern: config.routeFileIgnorePattern,
  disableLogging: true,
  strict: undefined,
  tokenRegexes: {
    indexTokenSegmentRegex,
    routeTokenSegmentRegex,
  },
});

Promise.resolve(physicalResult)
  .then(actual => {
    console.log('physicalGetRouteNodes resolved OK');
    const keys = Object.keys(actual);
    console.log('returned keys:', keys.join(', '));
    const { rootRouteNode, routeNodes, physicalDirectories } = actual;
    console.log();
    console.log('rootRouteNode present:', !!rootRouteNode);
    if (rootRouteNode) {
      console.log('  id           :', rootRouteNode.id);
      console.log('  routePath    :', rootRouteNode.routePath);
      console.log('  _fsRouteType :', rootRouteNode._fsRouteType);
      console.log('  variableName :', rootRouteNode.variableName ?? 'n/a');
      console.log('  filePath     :', rootRouteNode.filePath ?? 'n/a');
      console.log('  fullPath     :', rootRouteNode.fullPath ?? 'n/a');
    }
    console.log();
    console.log('total routeNodes:', routeNodes ? routeNodes.length : 'N/A');
    console.log('physicalDirectories:', physicalDirectories ? physicalDirectories.length : 'N/A');
    if (routeNodes && routeNodes.length) {
      console.log();
      console.log('=== physical reader route list (sorted by routePath) ===');
      const sorted = routeNodes.slice().sort((a, b) => (a.routePath || '').localeCompare(b.routePath));
      sorted.forEach((n, i) => {
        console.log(
          '[' + i + '] ' +
          'routePath=' + (n.routePath ?? 'n/a') +
          '  _fsRouteType=' + (n._fsRouteType ?? 'n/a') +
          '  variableName=' + (n.variableName ?? 'n/a') +
          (n.filePath && n.filePath !== '' ? '  filePath=' + path.basename(n.filePath) : '') +
          (n.id ? '  id=' + n.id : '')
        );
      });
    }
  })
  .catch(err => {
    console.log('physicalGetRouteNodes REJECTED:');
    console.log(String(err && (err.code || err.message || err.stack)).slice(0, 2500));
  });
