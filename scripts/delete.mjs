import path from 'node:path';
import fs from 'node:fs';
import {
  ensureDirExists,
  readReactorConfig,
  writeReactorConfig,
  writeRouter,
} from './utils.mjs';

export function registerDeleteCommands(program) {
  const del = program.command('delete');

  del
    .command('feature')
    .description('Delete a feature')
    .argument('<name>', 'feature name')
    .action((name) => {
      const featuresDir = path.resolve(
        process.cwd(),
        'src/features',
      );

      ensureDirExists(
        featuresDir,
        "Error: 'src/features' does not exist",
      );

      const featureDir = path.join(featuresDir, name);

      if (!fs.existsSync(featureDir)) {
        console.error(
          `Error: feature '${name}' does not exist`,
        );
        process.exit(1);
      }

      // remove feature directory
      fs.rmSync(featureDir, {
        recursive: true,
        force: true,
      });

      // update config
      const config = readReactorConfig();

      const nextFeatures = config.features.filter(
        (f) => f !== name,
      );

      const nextRoot =
        config.rootFeature === name
          ? null
          : config.rootFeature;

      writeReactorConfig(nextRoot, nextFeatures);

      // rewrite router
      writeRouter();

      // restore gitkeep if no features remain
      if (nextFeatures.length === 0) {
        fs.writeFileSync(
          path.join(featuresDir, '.gitkeep'),
          '',
        );
      }

      console.log(`Deleted feature: ${name}`);
    });
}