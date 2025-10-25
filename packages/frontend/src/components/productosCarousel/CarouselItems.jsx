import React, { useState } from "react";
import './CarouselItems.css'

const CarouselItems = ({items, CardItem}) => {
  const [index, setIndex] = useState(0);
  const visible = 3;

  const siguiente = () => {
    if (index < items.length - visible) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!Array.isArray(items) || items.length === 0) {
    return <p className="carousel-empty">No hay items disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div className="carousel-track"
          style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}>
            {items.map((item) => (
              <CardItem item={item} key={item.id}/> 
            ))}
          </div>
        </div>

        <button
          onClick={anterior}
          disabled={index === 0}
          className={`carousel-btn left-btn ${
            index === 0 ? "disabled" : ""
          }`}
        >
          ◀
        </button>

        <button
          onClick={siguiente}
          disabled={index >= items.length - visible}
          className={`carousel-btn right-btn ${
            index >= items.length - visible ? "disabled" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default CarouselItems;