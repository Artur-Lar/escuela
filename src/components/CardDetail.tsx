import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux-saga/store";
import { translateWordRequest } from "../redux-saga/cardDetailAction";
// import { uploadImageRequest } from "../redux-saga/imageActions";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import "./Styles-for-CardDetail.css";

interface Word {
  id: number;
  spanish: string;
  english: string;
  russian: string;
}

interface Card {
  id: number;
  title: string;
  words?: Word[];
  description?: string;
}

interface CardDetailProps {
  cards: Card[];
  addWord: (updatedCard: Card) => void;
  deleteWord: (cardId: number, wordId: number) => void;
}

const CardDetail: React.FC<CardDetailProps> = ({
  cards,
  addWord,
  deleteWord,
}) => {
  const { id: idParam } = useParams();
  const id = idParam ? parseInt(idParam, 10) : undefined;

  const card = cards.find((c) => c.id === id);
  const [newWord, setNewWord] = useState("");
  const [editWord, setEditWord] = useState<Word | null>(null);
  const [wordList, setWordList] = useState<Word[]>(card?.words || []);
  const [showWordList, setShowWordList] = useState<boolean>(true);
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const dispatch = useDispatch();

  const { translatedText, error } = useSelector(
    (state: RootState) => state.translate
  );

  // Начальное состояние с пятью испанскими словами и их переводами
  useEffect(() => {
    const initialWords: Word[] = [
      {
        id: 1,
        spanish: "casa",
        english: "house",
        russian: "дом",
      },
      {
        id: 2,
        spanish: "perro",
        english: "dog",
        russian: "собака",
      },
      {
        id: 3,
        spanish: "gato",
        english: "cat",
        russian: "кот",
      },
      {
        id: 4,
        spanish: "sol",
        english: "sun",
        russian: "солнце",
      },
      {
        id: 5,
        spanish: "agua",
        english: "water",
        russian: "вода",
      },
    ];

    setWordList(initialWords);
  }, []);

  const handleFirebaseImageUpload = async (file: File) => {
    const storageRef = ref(storage, file.name);

    try {
      const fileSnapshot = await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(fileSnapshot.ref);
      setSelectedImage(imageUrl);
      console.log("URL загруженного изображения:", imageUrl);
    } catch (error) {
      console.error(
        "Ошибка при загрузке изображения из Firebase Storage:",
        error
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFirebaseImageUpload(file);
    }
  };

  const handleAddWord = async () => {
    if (editWord !== null) {
      const updatedWordList = wordList.map((word) =>
        word.id === editWord.id ? { ...word, spanish: newWord } : word
      );
      setWordList(updatedWordList);
      setEditWord(null);
    } else {
      dispatch(translateWordRequest(newWord, "es", "en"));
      dispatch(translateWordRequest(newWord, "es", "ru"));
    }

    setNewWord("");
  };

  const handleEditWord = (word: Word) => {
    setNewWord(word.spanish);
    setEditWord(word);
  };

  const handleDeleteWord = (wordId: number) => {
    const updatedWordList = wordList.filter((word) => word.id !== wordId);
    setWordList(updatedWordList);

    if (card) {
      const updatedCard: Card = { ...card, words: updatedWordList };
      addWord(updatedCard);
    }
  };

  useEffect(() => {
    setIsInputEmpty(newWord.trim() === "");
  }, [newWord]);

  useEffect(() => {
    const isTranslatedTextValid = (
      text: any
    ): text is { en: string; ru: string } =>
      typeof text === "object" &&
      text !== null &&
      typeof text.en === "string" &&
      typeof text.ru === "string";

    if (isTranslatedTextValid(translatedText)) {
      const englishTranslation = translatedText.en;
      const russianTranslation = translatedText.ru;

      const newWordObj: Word = {
        id: Date.now(),
        spanish: newWord,
        english: englishTranslation,
        russian: russianTranslation,
      };

      setWordList((prevWordList) => [...prevWordList, newWordObj]);

      if (card) {
        const updatedCard: Card = {
          ...card,
          words: [...wordList, newWordObj],
        };
        addWord(updatedCard);
      }

      setShowWordList(true);
    }
  }, [translatedText]);

  useEffect(() => {
    if (error !== null) {
      console.error("Ошибка при запросе на перевод слова:", error);
    }
  }, [error]);

  if (!card) {
    return <div>Карточка не найдена</div>;
  }

  return (
    <div>
      {showInfo && (
        <div className="info-box">
          <p>
            <strong>
              Начните заполнять вашу карточку!!! <br /> Вы можете записать слово
              на испанском языке и в вашей карточке появятся переводы слова на
              английский и русский языки. Вы также можете редактировать слово на
              испанском
            </strong>
          </p>
          <button className="myButton" onClick={() => setShowInfo(false)}>
            Понятно
          </button>
        </div>
      )}
      <h1 className="cardDetailTitle">{card.title}</h1>

      {showWordList && (
        <>
          <button
            className="myButton"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            Загрузить изображение
          </button>
          <div
            className="image-container"
            style={{ backgroundImage: `url(${selectedImage})` }}
          ></div>
          <h2>Изучаемые слова:</h2>
          <ul className="list-of-words">
            {wordList.map((word) => (
              <li className="list-of-words-item" key={word.id}>
                <strong>Испанский:</strong> {word.spanish}{" "}
                <strong>Английский:</strong> {word.english}{" "}
                <strong>Русский:</strong> {word.russian}{" "}
                <button
                  className="myButton"
                  onClick={() => handleEditWord(word)}
                >
                  Редактировать
                </button>{" "}
                <button
                  className="myButton"
                  onClick={() => handleDeleteWord(word.id)}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <div>
        <h2>{editWord !== null ? "Редактировать" : "Добавить новое"} слово:</h2>
        <input
          className="myInput"
          type="text"
          placeholder="Испанское слово"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />
        <button
          className={`myButton ${isInputEmpty ? "disabledButton" : ""}`}
          onClick={handleAddWord}
          disabled={isInputEmpty}
        >
          {editWord !== null ? "Редактировать" : "Добавить слово"}
        </button>
      </div>
    </div>
  );
};

export default CardDetail;
