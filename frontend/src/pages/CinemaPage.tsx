import { useEffect, useState, useCallback } from "react";
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
    if (user) {
      loadTicketStatus();
    }
  }, []);

  useEffect(() => {
    if (user) loadTicketStatus();
  }, [user]);

  async function loadSeats() {
    try {
      const data = await getSeats();
      setSeats(data);
    } catch {
      setErrorMsg("Erro ao carregar poltronas.");
    }
  }

  async function loadTicketStatus() {
    if (!user) return;
    try {
      const status = await getTicketStatus(user.id);
      setHasTicket(status.hasTicket);
    } catch {
      setHasTicket(false);
    }
  }

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

  async function handleReserve(seatId: string) {
    if (!user || !hasTicket) return;
    if (selectedSeat === seatId) {
      setSelectedSeat(null);
      try {
        await reserveSeatReq(seatId, user.id);
        setHasTicket(false);
        setSuccessMsg("Poltrona reservada!");
        loadSeats();
      } catch {
        setErrorMsg("Erro ao reservar poltrona.");
        loadSeats();
        loadTicketStatus();
      }
    } else {
      setSelectedSeat(seatId);
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
        <SeatMap seats={seats} selectedId={selectedSeat} onSeatClick={handleReserve} />

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
