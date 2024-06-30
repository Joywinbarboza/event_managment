// components/WaveComponent.tsx
import React from "react";
import Wave from "react-wavify";

const WaveComponent: React.FC = () => {
  return (
    <>
      <Wave
        fill="#f799c2"
        paused={false}
        style={{ display: "flex" }}
        options={{
          height: 90,
          amplitude: 20,
          speed: 0.3,
          points: 3,
        }}
        className="absolute bottom-0 opacity-50"
      />
      <Wave
        fill="#5B94A2"
        paused={false}
        style={{ display: "flex" }}
        options={{
          height: 100,
          amplitude: 20,
          speed: 0.1,
          points: 3,
        }}
        className="absolute bottom-0 opacity-50"
      />
    </>
  );
};

export default WaveComponent;
