import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Asset } from "expo-asset";
import { InteractionManager } from "react-native";
import kuromoji from "@charlescoeder/react-native-kuromoji";
const TokenizerContext = createContext();

const dictFiles = {
  "base.dat.gz": require("../assets/dict/base.dat.gz"),
  "cc.dat.gz": require("../assets/dict/cc.dat.gz"),
  "check.dat.gz": require("../assets/dict/check.dat.gz"),
  "tid.dat.gz": require("../assets/dict/tid.dat.gz"),
  "tid_map.dat.gz": require("../assets/dict/tid_map.dat.gz"),
  "tid_pos.dat.gz": require("../assets/dict/tid_pos.dat.gz"),
  "unk.dat.gz": require("../assets/dict/unk.dat.gz"),
  "unk_char.dat.gz": require("../assets/dict/unk_char.dat.gz"),
  "unk_compat.dat.gz": require("../assets/dict/unk_compat.dat.gz"),
  "unk_invoke.dat.gz": require("../assets/dict/unk_invoke.dat.gz"),
  "unk_map.dat.gz": require("../assets/dict/unk_map.dat.gz"),
  "unk_pos.dat.gz": require("../assets/dict/unk_pos.dat.gz"),
};

export function TokenizerProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tokenizerRef = useRef(null);

  useEffect(() => {
    async function loadTokenizer() {
      try {
        setLoading(true);
        const assets = {};
        for (const [key, mod] of Object.entries(dictFiles)) {
          assets[key] = Asset.fromModule(mod);
        }
        await Promise.all(
          Object.values(assets).map((asset) => asset.downloadAsync())
        );
        InteractionManager.runAfterInteractions(() => {
          kuromoji.builder({ assets }).build((err, tokenizer) => {
            if (err) {
              setError(err);
              setLoading(false);
              return;
            }
            tokenizerRef.current = tokenizer;
            setLoading(false);
          });
        });
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    }
    loadTokenizer();
    return () => {
      tokenizerRef.current = null;
    };
  }, []);

  return (
    <TokenizerContext.Provider
      value={{
        tokenizer: tokenizerRef.current,
        loading,
        error,
      }}
    >
      {children}
    </TokenizerContext.Provider>
  );
}

export function useTokenizer() {
  return useContext(TokenizerContext);
}
