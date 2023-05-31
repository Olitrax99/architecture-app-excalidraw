import { SyncableExcalidrawElement } from ".";
import { decryptData, encryptData } from "../../data/encryption";
import { getSceneVersion } from "../../element";
import { ExcalidrawElement, FileId } from "../../element/types";
import Scene from "../../scene/Scene";
import { AppState, BinaryFileData } from "../../types";
import { ResolutionType } from "../../utility-types";
import Portal from "../collab/Portal";
import { storage } from "./storageConfig";

export interface StorageBase {

    isAppStored: (portal: Portal, elements: readonly ExcalidrawElement[]) => Promise<boolean>;
    storeApp: (portal: Portal, elements: readonly SyncableExcalidrawElement[], appState: AppState) => Promise<false | {reconciledElements: any}>;
    loadApp: (roomId: string, socket: SocketIOClient.Socket | null) => Promise<readonly ExcalidrawElement[] | undefined>;

    storeFiles: ({prefix, files}: {prefix: string, files: {id: FileId, buffer: Uint8Array}[]}) => Promise<{savedFiles: Map<FileId, true>, erroredFiles: Map<FileId, true>}>;
    loadFiles: (prefix: string, filesIds: readonly FileId[]) => Promise<{loadedFiles: BinaryFileData[], erroredFiles: Map<FileId, true>}>;

}

export interface StoredScene {
    sceneVersion: number;
    data: Uint8Array;
}

export const createSceneDocument = async (
    elements: readonly SyncableExcalidrawElement[],
) => {
    const sceneVersion = getSceneVersion(elements);
    return {
        sceneVersion: sceneVersion,
        data: await serializeData(elements),
    } as StoredScene;
};

export const serializeData = async (
    elements: readonly ExcalidrawElement[],
): Promise<Uint8Array> => {
    const json = JSON.stringify(elements);
    return new TextEncoder().encode(json);
};
  
const base64Decode = async (base64: string | Uint8Array): Promise<string> => {
    var decoder = new TextDecoder('utf-8');
    if(base64 instanceof Uint8Array)
        return decoder.decode(base64);
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return decoder.decode(bytes);
}

export const deserializeData = async (
    scene: StoredScene,
): Promise<readonly ExcalidrawElement[]> => {
    const decodedData = await base64Decode(scene.data);
    return JSON.parse(decodedData);
};

export const deserializePacket = async (
    data: ArrayBuffer,
): Promise<any> => {
    const decoded = new TextDecoder("UTF-8").decode(data);
    return JSON.parse(decoded);
}

export const cache = async (socket: SocketIOClient.Socket, elements: readonly SyncableExcalidrawElement[]) => {
    console.debug("cache called");
};

export const cached = async (socket: SocketIOClient.Socket): Promise<SyncableExcalidrawElement[] | undefined> => {
    return undefined;
}