import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  const [showWordList, setShowWordList] = useState<boolean>(false);
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState(true);

  const translateWord = async (
    word: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string | null> => {
    try {
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          word
        )}&langpair=${sourceLang}|${targetLang}`
      );

      if (response.data.responseData) {
        return response.data.responseData.translatedText;
      } else {
        console.error("Ошибка в ответе MyMemory API:", response.data);
        return null;
      }
    } catch (error: any) {
      console.error("Ошибка при обращении к MyMemory API:", error.message);
      return null;
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
      const englishTranslation = await translateWord(newWord, "es", "en");
      const russianTranslation = await translateWord(newWord, "es", "ru");

      if (englishTranslation !== null && russianTranslation !== null) {
        const newWordObj: Word = {
          id: Date.now(),
          spanish: newWord,
          english: englishTranslation,
          russian: russianTranslation,
        };
        setWordList([...wordList, newWordObj]);

        if (card) {
          const updatedCard: Card = {
            ...card,
            words: [...wordList, newWordObj],
          };
          addWord(updatedCard);
        }

        setShowWordList(true);
      }
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

  const handleHideInfo = () => {
    setShowInfo(false);
  };

  useEffect(() => {}, [card]);

  useEffect(() => {
    // Установка состояния пустого инпута
    setIsInputEmpty(newWord.trim() === "");
  }, [newWord]);

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
              на испанском языке и в вашу карточку добавятся переводы слова на
              английский и русский языки. Вы также можете редактировать слово на
              испанском
            </strong>
          </p>
          <button className="myButton" onClick={handleHideInfo}>
            Понятно
          </button>
        </div>
      )}
      <h1 className="cardDetailTitle">{card.title}</h1>

      {showWordList && (
        <>
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
          disabled={isInputEmpty} // Устанавливаем disabled на основе состояния пустого инпута
        >
          {editWord !== null ? "Редактировать" : "Добавить слово"}
        </button>
      </div>
    </div>
  );
};

export default CardDetail;
