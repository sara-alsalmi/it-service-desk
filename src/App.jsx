import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tickets from './pages/Tickets';
import SubmitTicket from './pages/SubmitTicket';
import TicketDetail from './pages/TicketDetail';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tickets />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
        <Route path="/submit" element={<SubmitTicket />} />
      </Routes>
    </BrowserRouter>
  );
}
