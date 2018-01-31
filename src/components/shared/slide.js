import React from "react";

const Slide = ({ children, title }) => {
  return (
    <section className="slide bordered-slide">
      <div className="container indented-container">
        <h1 className="slide-title">{title}</h1>
        {children}
      </div>
    </section>
  );
};

export default Slide;
