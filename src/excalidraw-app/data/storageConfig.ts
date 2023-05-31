import { APP_GET_CONTEXT } from "../../constants";
import { RestBasedStorage } from "./restBasedStorage";
import { StorageBase } from "./storageBase";

const initStorage = (): StorageBase => {
    return new RestBasedStorage(APP_GET_CONTEXT());
}

export const storage: StorageBase = initStorage();