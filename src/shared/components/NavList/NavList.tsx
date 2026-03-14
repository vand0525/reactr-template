import styles from './NavList.module.css';
import { reactorConfig } from '../../../reactr.config';
import { NavLink } from 'react-router-dom';
import { HStack } from '../';

export function NavList() {
  const { features, rootFeature } = reactorConfig;

  return (
    <HStack
      tag='nav'
      spacing={8}
      justify='end'
      className={styles.root}
    >
      {features.map((feature) => {
        const path =
          feature === rootFeature ? '/' : `/${feature}`;

        return (
          <NavLink
            key={feature}
            to={path}
          >
            {feature}
          </NavLink>
        );
      })}
      {features.length === 0 && (
        <p>
          Routes are generated automatically when features
          are added. Shared UI can be customized in{' '}
          <code>src/shared</code>.
        </p>
      )}
    </HStack>
  );
}
