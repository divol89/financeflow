const Dice = ({ spinning, dice }) => {
  return (
    <div
      className={`ml-4 w-8 h-8 bg-white rounded-full flex items-center justify-center ${spinning ? "animate-spin" : ""}`}
    >
      {dice}
    </div>
  );
};

export default Dice;
