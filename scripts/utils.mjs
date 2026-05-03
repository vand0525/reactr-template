import fs from 'node:fs';
import path from 'node:path';

export function ensureDirExists(dirPath, errorMessage) {
  if (!fs.existsSync(dirPath)) {
    console.error(errorMessage);
    process.exit(1);
  }
}

export function ensureDoesNotExist(
  targetPath,
  errorMessage,
) {
  if (fs.existsSync(targetPath)) {
    console.error(errorMessage);
    process.exit(1);
  }
}

export function makeDir(dirPath) {
  fs.mkdirSync(dirPath);
}

export function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
}

export function removeFileIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function toPascalCase(name) {
  return name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

export function componentTsx(name, useCss) {
  const cssImport = useCss
    ? `import styles from './${name}.module.css';\n\n`
    : '';

  const className = useCss
    ? ` className={styles.container}`
    : '';

  return `${cssImport}type ${name}Props = {
};

export function ${name}({}: ${name}Props) {
  return <div${className}>${name}</div>;
}
`;
}

export function componentCss() {
  return `.container {

}
`;
}

export function componentIndex(name) {
  return `export * from './${name}';\n`;
}

export function featureRootIndex(featureName) {
  const componentName = toPascalCase(featureName);
  return `export * from './${componentName}Shell';\n`;
}

export function featureShell(featureName) {
  const componentName = toPascalCase(featureName);

  return `import styles from './${componentName}Shell.module.css';
import { ${componentName}Page } from './pages/${componentName}Page';

export function ${componentName}Shell() {
  return (
    <div className={styles.root}>
      <${componentName}Page />
    </div>
  );
}
`;
}

export function featureShellCss() {
  return `.root {

}
`;
}

export function featurePage(featureName) {
  const componentName = toPascalCase(featureName);

  return `import styles from './${componentName}Page.module.css';

export function ${componentName}Page() {
  return (
    <div className={styles.container}>
      ${componentName} Page
    </div>
  );
}
`;
}

export function featurePageCss() {
  return `.container {

}
`;
}

export function hookTs(name) {
  const hookName = name.startsWith('use')
    ? name
    : `use${name}`;

  return `
import { useState } from 'react';

type ${hookName}Return = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export function ${hookName}(): ${hookName}Return {
  const [value, setValue] = useState('');

  return {
    value,
    setValue,
  };
}
`;
}

export function hookIndex(name) {
  const hookName = name.startsWith('use');

  return `export {${hookName}} from "./${hookName}";`
}

export function reactorConfigPath() {
  return path.resolve(
    process.cwd(),
    'src/reactr.config.ts',
  );
}

export function readReactorConfig() {
  const configPath = reactorConfigPath();

  if (!fs.existsSync(configPath)) {
    return {
      rootFeature: null,
      features: [],
    };
  }

  const file = fs.readFileSync(configPath, 'utf8');

  const rootMatch = file.match(
    /rootFeature:\s*(null|"[^"]*"|'[^']*')/,
  );

  const rootFeature =
    rootMatch && rootMatch[1] !== 'null'
      ? rootMatch[1].replace(/['"]/g, '')
      : null;

  const featuresMatch = file.match(
    /features:\s*\[(.*?)\]/s,
  );

  let features = [];

  if (featuresMatch) {
    const raw = featuresMatch[1].trim();

    if (raw) {
      features = raw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => value.replace(/['"]/g, ''));
    }
  }

  return {
    rootFeature,
    features,
  };
}

export function reactorConfigFile(rootFeature, features) {
  const sorted = [...features].sort((a, b) =>
    a.localeCompare(b),
  );

  const featureLines = sorted.map(
    (feature) => `    "${feature}"`,
  );

  return `export type ReactorConfig = {
  rootFeature: string | null;
  features: string[];
};

export const reactorConfig: ReactorConfig = {
  rootFeature: ${rootFeature ? `"${rootFeature}"` : 'null'},
  features: [
${featureLines.join(',\n')}
  ],
};
`;
}

export function writeReactorConfig(rootFeature, features) {
  writeFile(
    reactorConfigPath(),
    reactorConfigFile(rootFeature, features),
  );
}

export function registerFeature(
  featureName,
  setRoot = false,
) {
  const config = readReactorConfig();

  if (!config.features.includes(featureName)) {
    config.features.push(featureName);
  }

  if (setRoot) {
    config.rootFeature = featureName;
  }

  // if no root exists yet, first feature becomes root
  if (!config.rootFeature && config.features.length > 0) {
    config.rootFeature = config.features[0];
  }

  writeReactorConfig(config.rootFeature, config.features);
}

export function routerPath() {
  return path.resolve(process.cwd(), 'src/app/Router.tsx');
}

export function routerImport(feature) {
  const componentName = toPascalCase(feature);
  return `import { ${componentName}Shell } from '../features/${feature}';`;
}

export function routerRoute(feature, isRoot) {
  const componentName = toPascalCase(feature);

  if (isRoot) {
    return `        {
          index: true,
          element: <${componentName}Shell />,
        },`;
  }

  return `        {
          path: '${feature}',
          element: <${componentName}Shell />,
        },`;
}

export function routerFile(rootFeature, features) {
  const imports = features.map(routerImport).join('\n');

  const routes = features
    .map((feature) =>
      routerRoute(feature, feature === rootFeature),
    )
    .join('\n');

  return `import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
${imports ? `\n${imports}` : ''}

const BASE_URL = import.meta.env.BASE_URL;

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
${routes}
      ],
    },
  ],
  {
    basename: BASE_URL,
  },
);
`;
}

export function placeholderRouterFile() {
  return `import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';

const BASE_URL = import.meta.env.BASE_URL;

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: (
            <div>
              <h2>No features yet</h2>
              <p>
                This project uses the Reactr CLI to generate features and routes automatically.
              </p>
              <p>
                Run <code>reactr add &lt;feature-name&gt;</code> to create a new feature.  
                The CLI will scaffold the folder, update the router, and register it in the config.
              </p>
              <p>
                You can remove features with <code>reactr delete &lt;feature-name&gt;</code>.
              </p>
              <p>
                Shared UI such as navigation and layout components can be edited in <code>src/shared</code>.
              </p>
            </div>
          ),
        },
      ],
    },
  ],
  {
    basename: BASE_URL,
  },
);
`;
}

export function writeRouter() {
  const config = readReactorConfig();

  const rootFeature =
    config.rootFeature ??
    [...config.features].sort()[0] ??
    null;

  if (!rootFeature || config.features.length === 0) {
    writeFile(routerPath(), placeholderRouterFile());
    return;
  }

  writeFile(
    routerPath(),
    routerFile(rootFeature, config.features),
  );
}
