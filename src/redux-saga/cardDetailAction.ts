import { TRANSLATE_WORD_SUCCESS, TRANSLATE_WORD_FAILURE } from "./types";

export const translateWordRequest = (
  word: string,
  sourceLang: string,
  targetLang: string
) => ({
  type: "TRANSLATE_WORD_REQUEST",
  payload: { word, sourceLang, targetLang },
});

export const translateWordSuccess = (translatedText: string) => ({
  type: TRANSLATE_WORD_SUCCESS,
  payload: { translatedText },
});

export const translateWordFailure = (error: string) => ({
  type: TRANSLATE_WORD_FAILURE,
  payload: { error },
});
