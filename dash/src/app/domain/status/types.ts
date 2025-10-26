import { isObject } from '../../../util/types.ts';

interface DeployStatus {
  commit: string;
  timestamp: string;
}

function isDeployStatus(thing: unknown): thing is DeployStatus {
  return (
    isObject(thing) &&
    'commit' in thing &&
    typeof thing.commit === 'string' &&
    'timestamp' in thing &&
    typeof thing.timestamp === 'string'
  );
}

export { isDeployStatus };
export type { DeployStatus };
