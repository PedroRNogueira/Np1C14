import Seat from "./Seat";

interface SeatMapProps {
  seats: { id: string; row: string; number: number; status: "free" | "occupied" }[];
  selectedId: string | null;
  onSeatClick: (id: string) => void;
}

export default function SeatMap({ seats, selectedId, onSeatClick }: SeatMapProps) {
  const rows = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="seat-map">
      {rows.map((row) => (
        <div key={row} className="seat-row">
          <span className="row-label">{row}</span>
          <div className="seats">
            {seats
              .filter((s) => s.row === row)
              .map((seat) => {
                const status =
                  seat.status === "occupied"
                    ? "occupied"
                    : seat.id === selectedId
                    ? "selected"
                    : "free";
                return (
                  <Seat
                    key={seat.id}
                    label={seat.id}
                    status={status}
                    onClick={() => onSeatClick(seat.id)}
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
