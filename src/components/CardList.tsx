// CardList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Styles-for-CardList.css";

interface Card {
  id: number;
  title: string;
}

interface CardListProps {
  cards: Card[];
  addCard: (newCard: Card) => void;
  editCard: (editedCard: Card) => void;
  deleteCard: (cardId: number) => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  addCard,
  editCard,
  deleteCard,
}) => {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editingCardTitle, setEditingCardTitle] = useState("");
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    setIsInputEmpty(newCardTitle === "");
  }, [newCardTitle]);

  const handleAddCard = () => {
    const newCard: Card = {
      id: Date.now(),
      title: newCardTitle,
    };
    addCard(newCard);
    setNewCardTitle("");
  };

  const handleEditCard = (cardId: number) => {
    setEditingCardId(cardId);
    const cardToEdit = cards.find((card) => card.id === cardId);
    setEditingCardTitle(cardToEdit?.title || "");
  };

  const handleSaveCard = () => {
    if (editingCardId !== null) {
      const editedCard: Card = {
        id: editingCardId,
        title: editingCardTitle,
      };
      editCard(editedCard);
      setEditingCardId(null);
      setEditingCardTitle("");
    }
  };

  const inputStyle = {
    width: `${newCardTitle.length * 8}px`,
  };
  const handleHideInfo = () => {
    setShowInfo(false);
  };
  return (
    <div>
      {showInfo && (
        <div className="info-box">
          <p>
            <strong>
              Вы можете создавать, редактировать и удалять карточки
            </strong>
          </p>
          <button className="myButton" onClick={handleHideInfo}>
            Понятно
          </button>
        </div>
      )}
      <h1 className="cardListTitle">Список карточек</h1>
      <ul className="list_of_cards">
        {cards.map((card) => (
          <li className="list_of_cards-item" key={card.id}>
            {editingCardId === card.id ? (
              <>
                <input
                  className="myInput"
                  type="text"
                  value={editingCardTitle}
                  onChange={(e) => setEditingCardTitle(e.target.value)}
                />
                <button className="myButton" onClick={handleSaveCard}>
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <Link className="link_to_card" to={`/card/${card.id}`}>
                  {card.title}
                </Link>
                <div>
                  <button
                    className="myButton"
                    onClick={() => handleEditCard(card.id)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="myButton"
                    onClick={() => deleteCard(card.id)}
                  >
                    Удалить
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          className="myInput"
          style={inputStyle}
          type="text"
          maxLength={50}
          placeholder="Введите заголовок новой карточки"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
        <button
          className={`myButton ${isInputEmpty ? "disabledButton" : ""}`}
          disabled={isInputEmpty}
          onClick={handleAddCard}
        >
          Добавить карточку
        </button>
      </div>
    </div>
  );
};

export default CardList;
