interface SeatProps {
  label: string;
  status: "free" | "occupied" | "selected";
  onClick: () => void;
}

export default function Seat({ label, status, onClick }: SeatProps) {
  const disabled = status === "occupied";
  return (
    <button
      className={`seat seat--${status}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
    >
      {label}
    </button>
  );
}
