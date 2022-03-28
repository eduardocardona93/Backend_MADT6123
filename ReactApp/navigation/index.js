import React from 'react';

import { AuthenticatedUserProvider } from './AuthenticatedUserProvider';
import { NavigationContainer } from '@react-navigation/native';

import HomeStack from './HomeStack';

/**
 * Wrap all providers here
 */

export default function Routes() {
  return (
    <AuthenticatedUserProvider>
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </AuthenticatedUserProvider>  );
}
