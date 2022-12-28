import CHARACTER_FIRST_MATE from 'assets/card/character/first_mate.png';
import CHARACTER_FRENCHY from 'assets/card/character/first_mate.png';
import CHARACTER_LADY_LALIREN from 'assets/card/character/first_mate.png';
import CHARACTER_SIR_STEPHEN from 'assets/card/character/first_mate.png';
import CHARACTER_THE_CAPTAIN from 'assets/card/character/first_mate.png';
import CHARACTER_THE_KID from 'assets/card/character/first_mate.png';
import HATE_FIRST_MATE from 'assets/card/hate/first_mate.png';
import HATE_FRENCHY from 'assets/card/hate/first_mate.png';
import HATE_LADY_LALIREN from 'assets/card/hate/first_mate.png';
import HATE_SIR_STEPHEN from 'assets/card/hate/first_mate.png';
import HATE_THE_CAPTAIN from 'assets/card/hate/first_mate.png';
import HATE_THE_KID from 'assets/card/hate/first_mate.png';
import LOVE_FIRST_MATE from 'assets/card/love/first_mate.png';
import LOVE_FRENCHY from 'assets/card/love/first_mate.png';
import LOVE_LADY_LALIREN from 'assets/card/love/first_mate.png';
import LOVE_SIR_STEPHEN from 'assets/card/love/first_mate.png';
import LOVE_THE_CAPTAIN from 'assets/card/love/first_mate.png';
import LOVE_THE_KID from 'assets/card/love/first_mate.png';
import NAVIGATION_BG from 'assets/card/navigation/bg.png';
import NAVIGATION_FIGHT from 'assets/card/navigation/fight.png';
import NAVIGATION_OARS from 'assets/card/navigation/oars.png';
import PLACEHOLDER_CHARACTER from 'assets/card/placeholder/character.png';
import PLACEHOLDER_HATE from 'assets/card/placeholder/hate.png';
import PLACEHOLDER_LOVE from 'assets/card/placeholder/love.png';
import PLACEHOLDER_NAVIGATION from 'assets/card/placeholder/navigation.png';
import PLACEHOLDER_PROVISION from 'assets/card/placeholder/provision.png';
import PLACEHOLDER_ROLE from 'assets/card/placeholder/role.png';
import PROVISION_BLACKJACK from 'assets/card/provision/blackjack.png';
import PROVISION_BUCKET_OF_CHUM from 'assets/card/provision/bucket_of_chum.png';
import PROVISION_BUNDLE_OF_CASH from 'assets/card/provision/bundle_of_cash.png';
import PROVISION_COMPAS from 'assets/card/provision/compas.png';
import PROVISION_FLARE_GUN from 'assets/card/provision/flare_gun.png';
import PROVISION_GAFFING_HOOK from 'assets/card/provision/gaffing_hook.png';
import PROVISION_JEWELS from 'assets/card/provision/jewels.png';
import PROVISION_KNIFE from 'assets/card/provision/knife.png';
import PROVISION_LIFE_PRESERVER from 'assets/card/provision/life_preserver.png';
import PROVISION_MEDICAL_KIT from 'assets/card/provision/medical_kit.png';
import PROVISION_OAR from 'assets/card/provision/oar.png';
import PROVISION_PAINTING from 'assets/card/provision/painting.png';
import PROVISION_PARASOL from 'assets/card/provision/parasol.png';
import PROVISION_WATER from 'assets/card/provision/water.png';

import { IDXCardRoot } from './types';

export const card: IDXCardRoot = {
  character: {
    bg: {
      firstMate: CHARACTER_FIRST_MATE,
      frenchy: CHARACTER_FRENCHY,
      ladyLaliren: CHARACTER_LADY_LALIREN,
      sirStephen: CHARACTER_SIR_STEPHEN,
      theCaptain: CHARACTER_THE_CAPTAIN,
      theKid: CHARACTER_THE_KID,
    },
    placeholder: PLACEHOLDER_CHARACTER,
  },
  role: {
    bg: {
      firstMate: CHARACTER_FIRST_MATE,
      frenchy: CHARACTER_FRENCHY,
      ladyLaliren: CHARACTER_LADY_LALIREN,
      sirStephen: CHARACTER_SIR_STEPHEN,
      theCaptain: CHARACTER_THE_CAPTAIN,
      theKid: CHARACTER_THE_KID,
    },
    placeholder: PLACEHOLDER_ROLE,
  },
  hate: {
    bg: {
      firstMate: HATE_FIRST_MATE,
      frenchy: HATE_FRENCHY,
      ladyLaliren: HATE_LADY_LALIREN,
      sirStephen: HATE_SIR_STEPHEN,
      theCaptain: HATE_THE_CAPTAIN,
      theKid: HATE_THE_KID,
    },
    placeholder: PLACEHOLDER_HATE,
  },
  love: {
    bg: {
      firstMate: LOVE_FIRST_MATE,
      frenchy: LOVE_FRENCHY,
      ladyLaliren: LOVE_LADY_LALIREN,
      sirStephen: LOVE_SIR_STEPHEN,
      theCaptain: LOVE_THE_CAPTAIN,
      theKid: LOVE_THE_KID,
    },
    placeholder: PLACEHOLDER_LOVE,
  },
  navigation: {
    bg: NAVIGATION_BG,
    oars: NAVIGATION_OARS,
    fight: NAVIGATION_FIGHT,
    placeholder: PLACEHOLDER_NAVIGATION,
  },
  provision: {
    bg: {
      blackjack: PROVISION_BLACKJACK,
      bucketOfChum: PROVISION_BUCKET_OF_CHUM,
      bundleOfCash: PROVISION_BUNDLE_OF_CASH,
      compass: PROVISION_COMPAS,
      flareGun: PROVISION_FLARE_GUN,
      gaffingHook: PROVISION_GAFFING_HOOK,
      jewels: PROVISION_JEWELS,
      knife: PROVISION_KNIFE,
      lifePreserver: PROVISION_LIFE_PRESERVER,
      medicalKit: PROVISION_MEDICAL_KIT,
      oar: PROVISION_OAR,
      painting: PROVISION_PAINTING,
      parasol: PROVISION_PARASOL,
      water: PROVISION_WATER,
    },
    placeholder: PLACEHOLDER_PROVISION,
  },
} as const;
