import React from 'react';
import CardBox from "@/components/room/cards/card";

interface Card {
    key: string;
    value: string;
}

interface CardListProps {
    cards: Card[];
    onCardClick: (key: string, value: string) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onCardClick }) => {
    const [activeCardKey, setActiveCardKey] = React.useState<string | null>(null);
    const handleCardClick = (key: string, value: string) => {
        setActiveCardKey(key);
        onCardClick(key, value);
    };
    return (
        <div className="flex flex-wrap gap-4 p-2">
            {cards.map((card) => (
                <CardBox
                    key={card.key}
                    width="250px"
                    height="250px"
                    card={card}
                    isActive={activeCardKey === card.key} // Only active card will be highlighted
                    onCardClick={handleCardClick}
                />
            ))}
        </div>
    );
};

export default CardList;
