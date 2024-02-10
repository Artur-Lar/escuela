import {
  ImageActionTypes,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
} from "./imageActions";

interface ImageState {
  imageUrl: string | null;
  error: string | null;
}

const initialState: ImageState = {
  imageUrl: null,
  error: null,
};

const imageReducer = (
  state = initialState,
  action: ImageActionTypes
): ImageState => {
  switch (action.type) {
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        imageUrl: action.imageUrl,
        error: null,
      };
    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default imageReducer;
