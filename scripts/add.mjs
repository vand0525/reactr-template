import path from 'node:path';
import {
  componentCss,
  componentIndex,
  componentTsx,
  ensureDirExists,
  ensureDoesNotExist,
  featurePage,
  featurePageCss,
  featureRootIndex,
  featureShell,
  featureShellCss,
  makeDir,
  registerFeature,
  removeFileIfExists,
  toPascalCase,
  writeFile,
  writeRouter,
} from './utils.mjs';

export function registerAddCommands(program) {
  const add = program.command('add');

  add
    .command('feature')
    .description('Create a feature scaffold')
    .argument('<name>', 'feature name')
    .option('--no-components')
    .option('--no-hooks')
    .option('--no-context')
    .option('--no-services')
    .option('--no-types')
    .option('--no-utils')
    .option('--root', 'set feature as the root route')
    .action((name, options) => {
      const featuresDir = path.resolve(
        process.cwd(),
        'src/features',
      );

      ensureDirExists(
        featuresDir,
        "Error: 'src/features' does not exist",
      );

      removeFileIfExists(
        path.join(featuresDir, '.gitkeep'),
      );

      const featureDir = path.join(featuresDir, name);

      ensureDoesNotExist(
        featureDir,
        `Error: feature '${name}' already exists`,
      );

      makeDir(featureDir);

      const componentName = toPascalCase(name);

      writeFile(
        path.join(featureDir, `${componentName}Shell.tsx`),
        featureShell(name),
      );

      writeFile(
        path.join(
          featureDir,
          `${componentName}Shell.module.css`,
        ),
        featureShellCss(),
      );

      writeFile(
        path.join(featureDir, 'index.ts'),
        featureRootIndex(name),
      );

      const sections = [
        ['components', options.components],
        ['pages', true],
        ['hooks', options.hooks],
        ['context', options.context],
        ['services', options.services],
        ['types', options.types],
        ['utils', options.utils],
      ];

      for (const [dir, enabled] of sections) {
        if (!enabled) continue;

        const sectionDir = path.join(featureDir, dir);

        makeDir(sectionDir);
        writeFile(path.join(sectionDir, 'index.ts'), '');

        if (dir === 'pages') {
          writeFile(
            path.join(
              sectionDir,
              `${componentName}Page.tsx`,
            ),
            featurePage(name),
          );

          writeFile(
            path.join(
              sectionDir,
              `${componentName}Page.module.css`,
            ),
            featurePageCss(),
          );
        }
      }

      registerFeature(name, options.root);
      writeRouter();

      console.log(`Created feature: ${name}`);
    });

  add
    .command('component')
    .description('Create a component scaffold')
    .argument('<name>', 'component name')
    .argument('<target>', 'shared or feature name')
    .option('--no-css', 'disable css module')
    .action((name, target, options) => {
      let resolvedTarget;
      let displayTarget;

      if (target === 'shared') {
        resolvedTarget = path.resolve(
          process.cwd(),
          'src/shared/components',
        );
        displayTarget = 'src/shared/components';
      } else {
        const featureDir = path.resolve(
          process.cwd(),
          'src/features',
          target,
        );

        ensureDirExists(
          featureDir,
          `Error: feature '${target}' does not exist`,
        );

        resolvedTarget = path.join(
          featureDir,
          'components',
        );
        displayTarget = `src/features/${target}/components`;
      }

      ensureDirExists(
        resolvedTarget,
        `Error: '${displayTarget}' does not exist`,
      );

      const componentDir = path.join(resolvedTarget, name);

      ensureDoesNotExist(
        componentDir,
        `Error: component '${name}' already exists`,
      );

      makeDir(componentDir);

      writeFile(
        path.join(componentDir, `${name}.tsx`),
        componentTsx(name, options.css),
      );

      writeFile(
        path.join(componentDir, 'index.ts'),
        componentIndex(name),
      );

      if (options.css) {
        writeFile(
          path.join(componentDir, `${name}.module.css`),
          componentCss(),
        );
      }

      console.log(
        `Created component: ${displayTarget}/${name}`,
      );
    });
}
// add
//   .command('component')
//   .description('Create a component scaffold')
//   .argument('<name>', 'component name')
//   .argument('<target>', 'shared or feature name')
//   .option('--no-css', 'disable css module')
//   .action((name, target, options) => {

add
  .command('hook')
  .description('add a shared hook scaffold')
  .argument('<name>', 'hook name')
  .action((name) => {
    const displayPath = 'src/shared/hooks';
    let directoryPath;

    directoryPath = path.resolve(
      process.cwd(),
      displayPath,
    );

    ensureDirExists(
      directoryPath,
      `Error: ${displayPath} does not exist`,
    );

    const fileToWrite = `${directoryPath}/${name}.ts`;

    ensureDoesNotExist(
      fileToWrite, `Error: ${name} is already in ${displayPath}`
    )

    console.log(
      `Created component: ${displayPath}/${name}`
    )
  });
