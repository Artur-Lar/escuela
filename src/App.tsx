// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CardList from "./components/CardList";
import CardDetail from "./components/CardDetail";
import flagImage from "./images/spain-flag.jpg";
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

  return (
    <Router>
      <div className="flag-container">
        <img className="flag-image" src={flagImage} alt="Flag of Spain" />
      </div>
      <div className="content-container">
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
      </div>
    </Router>
  );
};

export default App;
