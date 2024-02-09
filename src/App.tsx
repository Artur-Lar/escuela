// App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CardList from "./components/CardList";
import CardDetail from "./components/CardDetail";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import "./App.css";

interface Card {
  id: number;
  title: string;
  description?: string;
  words?: Word[];
}

interface Word {
  id: number;
  spanish: string;
  english: string;
  russian: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyC8uKDQ-CId1T1KC1G5MQLTYfQZFvIGLlw",
  authDomain: "storied-line-386619.firebaseapp.com",
  projectId: "storied-line-386619",
  storageBucket: "storied-line-386619.appspot.com",
  messagingSenderId: "847786641652",
  appId: "1:847786641652:web:8a2423936f3c50fb3ff6a1",
  measurementId: "G-X33LSDMDH2",
};

const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  // Возможно, здесь вам нужно будет добавить дополнительные настройки Firebase, например, для базы данных, аутентификации и т.д.
};

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { id: 1, title: "Карточка 1", description: "Описание карточки 1" },
    { id: 2, title: "Карточка 2", description: "Описание карточки 2" },
  ]);

  const addCard = (newCard: Card) => {
    setCards([...cards, newCard]);
  };

  const deleteCard = (cardId: number) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
  };

  const editCard = (editedCard: Card) => {
    const updatedCards = cards.map((card) =>
      card.id === editedCard.id ? editedCard : card
    );
    setCards(updatedCards);
  };

  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <CardList
              cards={cards}
              editCard={editCard}
              addCard={addCard}
              deleteCard={deleteCard}
            />
          }
        />
        <Route
          path="/card/:id"
          element={
            <CardDetail
              cards={cards}
              addWord={() => {}}
              deleteWord={() => {}}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
