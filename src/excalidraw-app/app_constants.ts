// time constants (ms)
export const SAVE_TO_LOCAL_STORAGE_TIMEOUT = 300;
export const INITIAL_SCENE_UPDATE_TIMEOUT = 5000;
export const FILE_UPLOAD_TIMEOUT = 300;
export const LOAD_IMAGES_TIMEOUT = 500;
export const SYNC_FULL_SCENE_INTERVAL_MS = 20000;
export const SYNC_BROWSER_TABS_TIMEOUT = 50;
export const CURSOR_SYNC_TIMEOUT = 33; // ~30fps
export const DELETED_ELEMENT_TIMEOUT = 24 * 60 * 60 * 1000; // 1 day

export const FILE_UPLOAD_MAX_BYTES = 3 * 1024 * 1024; // 3 MiB
// 1 year (https://stackoverflow.com/a/25201898/927631)
export const FILE_CACHE_MAX_AGE_SEC = 31536000;

export const WS_EVENTS = {
  SERVER_VOLATILE: "server-volatile-broadcast",
  SERVER: "server-broadcast",
};

export enum WS_SCENE_EVENT_TYPES {
  INIT = "SCENE_INIT",
  UPDATE = "SCENE_UPDATE",
}

export const FIREBASE_STORAGE_PREFIXES = {
  shareLinkFiles: `/files/shareLinks`,
  collabFiles: `/files/rooms`,
};

export const ROOM_ID_BYTES = 10;

export const STORAGE_KEYS = {
  LOCAL_STORAGE_ELEMENTS: "architecture-app",
  LOCAL_STORAGE_APP_STATE: "architecture-app-state",
  LOCAL_STORAGE_COLLAB: "architecture-app-collab",
  LOCAL_STORAGE_LIBRARY: "architecture-app-library",
  LOCAL_STORAGE_THEME: "architecture-app-theme",
  VERSION_DATA_STATE: "version-dataState",
  VERSION_FILES: "version-files",
} as const;

export const SESSION_COOKIE = "io";