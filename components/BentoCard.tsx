import React from "react";

type BentoCardProps = {
  title: React.ReactNode; // Allows strings or JSX
  description?: string;   // Makes `description` optional
};

const BentoCard: React.FC<BentoCardProps> = ({ title, description }) => {
  return (
    <div className="relative size-full">
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>
      </div>
      {title}
    </div>
  );
};

export default BentoCard;

