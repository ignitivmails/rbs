import * as migration_20261019_183337_initial from './20261019_183337_initial';
import * as migration_20261019_192113_media_storage_fields from './20261019_192113_media_storage_fields';

export const migrations = [
  {
    up: migration_20261019_183337_initial.up,
    down: migration_20261019_183337_initial.down,
    name: '20261019_183337_initial',
  },
  {
    up: migration_20261019_192113_media_storage_fields.up,
    down: migration_20261019_192113_media_storage_fields.down,
    name: '20261019_192113_media_storage_fields'
  },
];
