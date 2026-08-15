import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Tickets from './pages/Tickets';
import SubmitTicket from './pages/SubmitTicket';
import TicketDetail from './pages/TicketDetail';
import Alerts from './pages/Alerts';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ticket-queue" replace />} />
        <Route path="/ticket-queue" element={<Tickets />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
        <Route path="/submit" element={<SubmitTicket />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  );
}
