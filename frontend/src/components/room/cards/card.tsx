import React from 'react';

interface Card {
    key: string;
    value: string;
}

interface CardBoxProps {
    width: string;
    height: string;
    card: Card;
    onCardClick: (key: string, value: string) => void;
    isActive: boolean;
}

const CardBox: React.FC<CardBoxProps> = ({ width, height, card, onCardClick, isActive }) => {
    const handleClick = () => {
        onCardClick(card.key, card.value);
    };
    if (sessionStorage.getItem('cardKey') !== "") {
        if (sessionStorage.getItem('cardKey') === card.key) {
            isActive = true;
        }
    }

    return (
        <div
            className={`border border-gray-300 rounded-lg flex flex-col justify-center items-center shadow-lg cursor-pointer transition-all duration-300 ${
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-50'
            }`}
            style={{
                width,
                height,
            }}
            onClick={handleClick}
        >
            <p className="text-sm">{card.value}</p>
        </div>
    );
};

export default CardBox;
