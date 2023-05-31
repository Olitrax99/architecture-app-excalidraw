import { RestBasedStorage } from "./restBasedStorage";
import { StorageBase } from "./storageBase";

const initStorage = (): StorageBase => {
    return new RestBasedStorage(window.location.origin);
}

export const storage: StorageBase = initStorage();