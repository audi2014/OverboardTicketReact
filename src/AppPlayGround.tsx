import { ResourcesProvider, useResources } from 'domain/resources/ResourcesContext';
import { Navigation } from 'ui/card/navigation';

export const NavigationWithAssets = () => {
  const r = useResources();
  return (
    <Navigation
      overBoardCharacters={['overBoardCharacters']}
      thirstyCharacters={['thirstyCharacters']}
      thirstyFight={true}
      thirstyOars={true}
      textOverBoard={'textOverBoard'}
      textThirsty={'textThirsty'}
      srcBg={r.assets.card.navigation.bg}
      srcOars={r.assets.card.navigation.oars}
      srcFight={r.assets.card.navigation.fight}
    />
  );
};

export const AppPlayGround = () => {
  return (
    <ResourcesProvider>
      <NavigationWithAssets />
    </ResourcesProvider>
  );
};
