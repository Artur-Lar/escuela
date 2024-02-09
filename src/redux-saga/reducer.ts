// reducer.ts
import {
  REQUEST_TRANSLATE_WORD,
  TRANSLATE_WORD_SUCCESS,
  TRANSLATE_WORD_FAILURE,
} from "./types";

export interface TranslateState {
  translatedText: string | null;
  error: string | null;
}

const initialState: TranslateState = {
  translatedText: null,
  error: null,
};

const translateReducer = (
  state = initialState,
  action: any
): TranslateState => {
  switch (action.type) {
    case REQUEST_TRANSLATE_WORD:
      return {
        ...state,
        translatedText: null,
        error: null,
      };
    case TRANSLATE_WORD_SUCCESS:
      return {
        ...state,
        translatedText: action.payload.translatedText,
        error: null,
      };
    case TRANSLATE_WORD_FAILURE:
      return {
        ...state,
        translatedText: null,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default translateReducer;
