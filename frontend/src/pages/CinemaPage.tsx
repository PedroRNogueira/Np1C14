import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSeats, getTicketStatus, claimTicketReq, reserveSeatReq } from "../api/client";
import SeatMap from "../components/SeatMap";
import Screen from "../components/Screen";

export default function CinemaPage() {
  const { user, logout } = useAuth();
  const [seats, setSeats] = useState<Awaited<ReturnType<typeof getSeats>>>([]);
  const [hasTicket, setHasTicket] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadSeats();
  }, []);

  useEffect(() => {
    if (user) loadTicketStatus();
  }, [user]);

  const loadSeats = async () => {
    try {
      const data = await getSeats();
      setSeats(data);
    } catch {
      setErrorMsg("Erro ao carregar poltronas.");
    }
  };

  const loadTicketStatus = async () => {
    if (!user) return;
    try {
      const status = await getTicketStatus(user.id);
      setHasTicket(status.hasTicket);
    } catch {
      setHasTicket(false);
    }
  };

  async function handleGetTicket() {
    if (!user) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await claimTicketReq(user.id);
      setHasTicket(true);
      setSuccessMsg("Ticket obtido com sucesso!");
    } catch {
      setErrorMsg("Voce ja possui um ticket ativo.");
    }
  }

  async function handleSeatClick(seatId: string) {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.status === "occupied") return;
    if (!user) return;
    if (!hasTicket) {
      setErrorMsg("Voce precisa pegar um ticket antes de reservar.");
      return;
    }

    if (selectedSeat === seatId) {
      try {
        await reserveSeatReq(seatId, user.id);
        setSelectedSeat(null);
        setHasTicket(false);
        setSuccessMsg("Poltrona reservada!");
        loadSeats();
        if (user) loadTicketStatus();
      } catch {
        setErrorMsg("Erro ao reservar poltrona.");
        loadSeats();
        if (user) loadTicketStatus();
      }
    } else {
      setSelectedSeat(seatId);
      setErrorMsg("");
    }
  }

  return (
    <div className="cinema-page">
      <header className="cinema-header">
        <h1>Cinema</h1>
        <div className="cinema-header-right">
          <span className="user-name">{user?.username}</span>
          <button className="btn-secondary" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <div className="cinema-body">
        <div className="ticket-section">
          {!hasTicket ? (
            <button className="btn-primary btn-ticket" onClick={handleGetTicket}>
              Pegar ticket
            </button>
          ) : (
            <div className="ticket-badge">Ticket ativo — selecione uma poltrona</div>
          )}
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}

        <Screen />
        <SeatMap seats={seats} selectedId={selectedSeat} onSeatClick={handleSeatClick} />

        <div className="legend">
          <div className="legend-item">
            <span className="seat-legend seat--free" />
            <span>Livre</span>
          </div>
          <div className="legend-item">
            <span className="seat-legend seat--selected" />
            <span>Selecionada</span>
          </div>
          <div className="legend-item">
            <span className="seat-legend seat--occupied" />
            <span>Ocupada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
