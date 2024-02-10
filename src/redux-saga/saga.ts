import { put, takeEvery, call } from "redux-saga/effects";
import axios from "axios";
import { translateWordSuccess, translateWordFailure } from "./cardDetailAction";

function* translateWordSaga(action: any): Generator<any, void, any> {
  const { word, sourceLang, targetLang } = action.payload;

  try {
    const response = yield call(
      axios.get,
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        word
      )}&langpair=${sourceLang}|${targetLang}`
    );
    const translatedText = response.data.responseData.translatedText;
    yield put(translateWordSuccess(translatedText));
  } catch (error: any) {
    yield put(translateWordFailure(error.message));
  }
}

function* rootSaga() {
  yield takeEvery("TRANSLATE_WORD_REQUEST", translateWordSaga);
}

export default rootSaga;
