import { getSyncableElements, SyncableExcalidrawElement } from ".";
import { restoreElements } from "../../data/restore";
import { ExcalidrawElement, FileId } from "../../element/types";
import { AppState, BinaryFileData } from "../../types";
import Portal from "../collab/Portal";
import { reconcileElements } from "../collab/reconciliation";
import { cache, cached, createSceneDocument, deserializeData, StorageBase, StoredScene } from "./storageBase";
import { getSceneVersion } from "../../element";
import { storage } from "./storageConfig";
import Scene from "../../scene/Scene";

export class RestBasedStorage implements StorageBase {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    isAppStored = async (portal: Portal, elements: readonly ExcalidrawElement[]): Promise<boolean> => {
        if (portal.socket && portal.roomId) {
            const sceneVersion = getSceneVersion(elements);
            //const cachedScene = await cached(portal.socket);
            const storedScene = await this.loadApp(portal.roomId, portal.socket);
            if(!storedScene) {
                console.debug("No app stored...")
                return false;
            }
            const storedVersion = getSceneVersion(storedScene);
            console.debug(`storedVersion: ${storedVersion} sceneVersion: ${sceneVersion}`);
            return storedVersion === sceneVersion;
          }
          // if no room exists, consider the room saved so that we don't unnecessarily
          // prevent unload (there's nothing we could do at that point anyway)
          console.debug("No room exists");
          return true;
    };

    storeApp = async (portal: Portal, elements: readonly SyncableExcalidrawElement[], appState: AppState): Promise<false | { reconciledElements: any; }> => {
        console.debug("storing app");
        const { roomId, socket } = portal;
        if (
            // bail if no room exists as there's nothing we can do at this point
            !roomId ||
            !socket ||
            await this.isAppStored(portal, elements)
        ) {
            return false;
        }

        const loadData = async () => {
            const scene = await this.loadScene(roomId);
            if (!scene) {
                console.debug("Scene not yet stored. saving...")
                const sceneDocument = await createSceneDocument(
                    elements,
                );
                this.storeScene(roomId, sceneDocument);
                return {
                    elements,
                    reconciledElements: null,
                };
            }

            const prevDocData = scene;
            const prevElements = getSyncableElements(
                await deserializeData(prevDocData),
            );
            const reconciledElements = getSyncableElements(
                reconcileElements(elements, prevElements, appState),
            );
            const sceneDocument = await createSceneDocument(
                reconciledElements,
            );
            this.storeScene(roomId, sceneDocument);
            return {
                elements,
                reconciledElements,
            };
        }

        const savedData = await loadData()
        cache(socket, savedData.elements);
        return { reconciledElements: savedData.reconciledElements };
    };

    loadApp = async (roomId: string, socket: SocketIOClient.Socket | null): Promise<readonly ExcalidrawElement[] | undefined> => {
        console.debug("loading app");
        if(socket == null)
            return undefined;
        const cachedScene = await cached(socket);
        if (cachedScene) {
            return cachedScene;
        }

        const storedScene = await this.loadScene(roomId);
        if(!storedScene)
            return undefined;

        const elements = getSyncableElements(
            await deserializeData(storedScene),
        );

        if (socket) {
            cache(socket, elements);
        }

        return restoreElements(elements, null);
    };

    storeFiles = async (o : {prefix: string, files: {id: FileId, buffer: Uint8Array}[]}): Promise<{ savedFiles: Map<FileId, true>; erroredFiles: Map<FileId, true>; }> => {
        console.debug("storing files");
        const savedFiles = new Map<FileId, true>();
        const erroredFiles = new Map<FileId, true>();

        return {savedFiles, erroredFiles};
    };

    loadFiles = async (prefix: string, filesIds: readonly FileId[]): Promise<{ loadedFiles: BinaryFileData[]; erroredFiles: Map<FileId, true>; }> => {
        console.debug("loading files");
        const loadedFiles: BinaryFileData[] = [];
        const erroredFiles = new Map<FileId, true>();

        return {loadedFiles, erroredFiles};
    }

    storeScene = async (roomId: string, scene: StoredScene) => {
        console.debug("storing scene");
        await fetch(`${this.endpoint}/storage/storeScene?room=${roomId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "data": Array.from(scene.data),
                "sceneVersion": scene.sceneVersion,
            }),
        });
    }

    loadScene = async (roomId: string): Promise<StoredScene | undefined> => {
        const response = await fetch(`${this.endpoint}/storage/loadScene?room=${roomId}`);
        try {
            return await response.json();
        } catch (error: any) {
            console.debug(`scene not found for room ${roomId}`);
            return undefined;
        }
    }

}