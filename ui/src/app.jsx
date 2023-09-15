import React, { useEffect, useState, useCallback } from "react";
import { api } from "./state/api";
import useStorageState from "./state/storage";
import { useFileStore } from "./state/useFileStore";
import { useAsyncCall } from "./lib/useAsyncCall";

export function App() {
  const { s3 } = useStorageState();
  const credentials = s3.credentials;
  const configuration = s3.configuration;
  const { client, createClient, getFiles } = useFileStore();
  const { call: loadFiles } = useAsyncCall(
    useCallback(async (s3) => {
      return getFiles(s3);
    }, []),
    useFileStore
  );
  const [albums, setAlbums] = useState();


  useEffect(() => {
    async function init() {
      useStorageState.getState().initialize(api);
      // albums are an array of arrays, each sub-array is a tuple of album id and owner
      // eg. [['beach', '~zod'], ...]
      const albums = (
        await api.scry({
          app: "albums",
          path: "/list",
        })
      )?.["album-ids"];
      setAlbums(albums);
      console.log(albums);
    }

    init();
  }, []);

  useEffect(() => {
    const hasCredentials =
      credentials?.accessKeyId &&
      credentials?.endpoint &&
      credentials?.secretAccessKey && configuration;
    if (hasCredentials) {
      createClient(credentials, configuration.region);

      useStorageState.setState({ hasCredentials: true });
      console.log("client initialized");
    }
  }, [credentials, configuration]);

  useEffect(() => {
    loadFiles(s3);
  }, [loadFiles, s3, client]);

  return (
    <main className="flex items-center justify-center min-h-screen"></main>
  );
}
