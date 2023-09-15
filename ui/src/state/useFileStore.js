import {
    CopyObjectCommand,
    DeleteObjectCommand,
    paginateListObjectsV2,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isDev, runWithAsyncHandling } from "../lib/util";

export function normalizeRoot(path) {
    return path[0] === "/" ? path.slice(1) : path;
}

export function splitPath(path) {
    const normPath = normalizeRoot(path);

    if (normPath === "") {
        return ["/"];
    }

    return ["/", ...normPath.split("/")];
}

export function getFileInfo(
    filepath
) {
    const normFilepath = normalizeRoot(filepath);
    const index = normFilepath.lastIndexOf("/");
    const folder = index !== -1 ? "/" + normFilepath.slice(0, index) : "/";
    const filename = normFilepath.slice(index + 1);
    const { name, extension } = getFilenameParts(filename);
    const datePattern = /(\d{4}\.\d{1,2}\.\d{2}\.\.(\d{2}\.?){3})-/;
    const dateMatch = filename.match(datePattern);
    const date = dateMatch ? dateMatch[1] : "";
    const filenameMinusDate = filename.replace(datePattern, "");

    return {
        filename,
        filenameMinusDate,
        name,
        date,
        extension,
        folder,
    };
}

export function prefixEndpoint(endpoint) {
    return endpoint.match(/https?:\/\//) ? endpoint : `https://${endpoint}`;
}

export function getFileUrl(key, s3) {
    const endpoint = s3.credentials?.endpoint;
    if (!endpoint) {
        return "";
    }

    const normEndpoint = endpoint.slice(-1) === "/" ? endpoint : endpoint + "/";
    const withProtocol = prefixEndpoint(normEndpoint);
    const end = key.split('/').map(encodeURIComponent).join('/');
    return `${withProtocol}${s3.configuration.currentBucket}/${end}`;
}

export function getFilenameParts(filename) {
    const extIndex = filename.lastIndexOf(".");
    const name = filename.slice(0, extIndex);
    const extension = filename.slice(extIndex + 1);

    return {
        name,
        extension: (extension || ""),
    };
}

export function filesEqual(fileA, fileB) {
    return fileA.folder === fileB.folder && fileA.filename === fileB.filename;
}

function parseFolderIntoTree(
    folders,
    previous
) {
    const folder = folders[0];

    if (typeof folder === "undefined") {
        return;
    }

    const path =
        folder === "/"
            ? "/"
            : previous !== "/"
                ? `${previous}/${folder}`
                : previous + folder;
    const tree = parseFolderIntoTree(folders.slice(1), path);
    return {
        name: folder,
        path,
        pathSegments: splitPath(path),
        children: tree ? [tree] : [],
        editing: false,
    };
}

// assume trees both start at same height aka "root"
function mergeTrees(
    treeA,
    treeB
) {
    if (treeA.name !== treeB.name) {
        return;
    }

    const children = [];
    for (const child of treeA.children) {
        const sameB = treeB.children.find((c) => c.name === child.name);

        if (sameB) {
            const merged = mergeTrees(child, sameB);
            if (merged) {
                children.push(merged);
            } else {
                throw new Error("something very wrong happened");
            }
        } else {
            children.push(child);
        }
    }

    treeB.children
        .filter((b) => !children.find((c) => c.name === b.name))
        .forEach((child) => {
            children.push(child);
        });

    return {
        ...treeA,
        children,
    };
}

export function searchTree(
    tree,
    stop
) {
    if (stop(tree)) {
        return tree;
    }

    for (const child of tree.children) {
        const search = searchTree(child, stop);

        if (search) {
            return search;
        }
    }
}

export function traverseTree(
    partialPath,
    tree,
    stop
) {
    const segments =
        partialPath[0] === "/" ? splitPath(partialPath) : partialPath.split("/");
    const first = segments[0];

    if (typeof first === "undefined") {
        return;
    }

    if ((stop && stop(tree)) || tree.name === partialPath) {
        return tree;
    }

    for (const child of tree.children) {
        const nextPath = segments.slice(1).join("/");
        if (child.name === segments[1]) {
            return traverseTree(nextPath, child);
        }
    }
}

// function pruneTree(tree: FolderTree, files: File[]): FolderTree {

// }

const root = {
    name: "/",
    path: "/",
    pathSegments: ["/"],
    children: [],
    editing: false,
};

export const useFileStore = create(
    persist(
        (set, get) => ({
            client: null,
            status: "initial",
            files: [],
            folders: root,
            currentFolder: root,
            currentFile: null,
            createClient: (credentials, region) => {
                const endpoint = new URL(prefixEndpoint(credentials.endpoint));
                const client = new S3Client({
                    endpoint: {
                        protocol: endpoint.protocol,
                        hostname: endpoint.host,
                        path: endpoint.pathname || "/",
                    },
                    region: region || "us-east-1",
                    credentials,
                    forcePathStyle: true, // needed with minio?
                });

                set({ client });
            },
            setCurrentFile: (key, folder) => {
                const file = get().files.find(
                    (file) =>
                        `${file.folder === "/" ? "" : file.folder}/${file.filename}` === key
                );

                if (file) {
                    set({ currentFile: file, currentFolder: folder });
                }

                return file;
            },
            getFiles: async (s3) => {
                const { client, setFiles } = get();
                if (!client || !s3.configuration.currentBucket) {
                    return;
                }

                // const listObjects = new ListObjectsV2Command({
                //   Bucket: s3.configuration.currentBucket,
                // });

                // const resp = await client.send(listObjects);

                const paginator = paginateListObjectsV2({
                    client,
                    pageSize: 1000,
                }, {
                    Bucket: s3.configuration.currentBucket,
                });

                const files = [];
                for await (const page of paginator) {
                    files.push(...(page.Contents || []))
                }

                setFiles(files, s3);
            },
            setFiles: (newFiles, s3) => {
                let tree = root;
                const files = newFiles
                    .map((file) => {
                        const key = file.Key || "";
                        const { folder, filename, ...info } = getFileInfo(key);
                        const newTree = parseFolderIntoTree(splitPath(folder));
                        isDev && console.log(key);

                        if (newTree) {
                            const mergedTrees = mergeTrees(tree, newTree);
                            if (mergedTrees) {
                                tree = mergedTrees;
                            }
                        }

                        if (!filename) {
                            return null;
                        }

                        return {
                            data: file,
                            url: getFileUrl(file.Key || "", s3),
                            ancestors: splitPath(folder),
                            folder,
                            filename,
                            ...info,
                        };
                    })
                    .filter((file) => file !== null);

                set({
                    files,
                    folders: tree,
                });
            },
            deleteFile: async (file, s3) => {
                const { client, files, currentFile } = get();
                if (!client) {
                    return;
                }

                const index = files.findIndex(f => f.data.Key === file.data.Key);
                files.splice(index, 1);

                const current = currentFile === file ? null : currentFile;

                set({ files: [].concat(files), currentFile: current })

                await client.send(new DeleteObjectCommand({
                    Bucket: s3.configuration.currentBucket,
                    Key: file.data.Key
                }))
            },
            moveFile: async (file, folder, s3) => {
                const { client, currentFile } = get();
                const bucket = s3.configuration.currentBucket;

                if (!client) {
                    return;
                }

                try {
                    const key = `${folder.path.slice(1)}/${file.filename}`;
                    await runWithAsyncHandling(() => {
                        return client.send(new CopyObjectCommand({
                            Bucket: bucket,
                            CopySource: `${bucket}/${file.data.Key}`,
                            Key: key,
                            ACL: "public-read"
                        }))
                    }, async (error) => {
                        const res = await fetch(getFileUrl(file.data.Key || '', s3), {
                            mode: 'cors',
                            headers: {
                                'Accept': '*/*'
                            }
                        });
                        if (!res) {
                            throw error;
                        }

                        return client.send(new PutObjectCommand({
                            Bucket: bucket,
                            Key: key,
                            Body: await res.blob(),
                            ACL: "public-read"
                        }));
                    });

                    await client.send(new DeleteObjectCommand({
                        Bucket: bucket,
                        Key: file.data.Key
                    }))

                    file.folder = folder.path;
                    const current = currentFile === file ? null : currentFile;
                    set(state => ({ files: [].concat(state.files), currentFile: current }))

                    setTimeout(() => {
                        get().getFiles(s3)
                    }, 100);
                } catch (error) {
                }
            },
            hasFiles: (folder) => {
                return get().files.some(file => file.folder === folder.path);
            },
            addFolder: (folder) => {
                if (folder.children.find((c) => c.editing)) {
                    return;
                }

                folder.children.push({
                    name: "",
                    path: folder.path,
                    pathSegments: folder.pathSegments,
                    children: [],
                    editing: true,
                });

                set({ folders: { ...get().folders } });
            },
            removeFolder: async (folder, s3) => {
                const { client, getFiles, hasFiles, folders, currentFolder } = get();

                if (!client) {
                    return;
                }

                if (hasFiles(folder)) {
                    throw new Error('Can\'t delete folders with files');
                }
                debugger;

                const parentPath = normalizeRoot(folder.path).split('/').slice(0, -1).join('/');
                const parent = traverseTree(`/${parentPath}`, folders);
                if (!parent) {
                    return;
                }

                const index = parent.children.findIndex((c) => c.path === folder.path);
                if (index < 0) {
                    return;
                }

                const current = currentFolder === folder ? folders : currentFolder;

                parent.children.splice(index, 1);
                set({ folders: { ...folders }, currentFolder: current });

                await client.send(new DeleteObjectCommand({
                    Bucket: s3.configuration.currentBucket,
                    Key: folder.path.slice(1) + '/'
                }))

                getFiles(s3);
            },
            removeEditingFolder: () => {
                const { folders } = get();
                const editingFolder = searchTree(folders, (tree) => tree.editing);
                if (!editingFolder) {
                    return;
                }

                const parent = traverseTree(editingFolder.path, folders);
                if (!parent) {
                    return;
                }

                const index = parent.children.findIndex((c) => c.editing);
                if (index >= 0) {
                    parent.children.splice(index, 1);
                    set({ folders: { ...folders } });
                }
            },
            makeFolder: async (key, bucket) => {
                const { client, currentFolder } = get();
                if (!client) {
                    return;
                }

                const current = currentFolder.path === "/" ? "" : currentFolder.path;
                const folderPath = `${current}/${key}`;
                const editingFolder = currentFolder.children.find((c) => c.editing);

                if (editingFolder) {
                    editingFolder.name = key;
                    editingFolder.path = folderPath;
                    editingFolder.pathSegments = splitPath(folderPath);
                    editingFolder.editing = false;
                }

                set({ currentFolder: { ...currentFolder } });

                return client.send(
                    new PutObjectCommand({
                        Bucket: bucket,
                        Key: normalizeRoot(folderPath) + "/",
                        ACL: "public-read",
                    })
                );
            },
        }),
        {
            name: `${window.ship}/${window.desk}/file-store'`,
            partialize: ({ currentFolder, client, currentFile, ...state }) => {
                return state;
            },
        }
    )
);