import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Tickets from './pages/Tickets';
import SubmitTicket from './pages/SubmitTicket';
import TicketDetail from './pages/TicketDetail';
import Alerts from './pages/Alerts';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/submit" element={<SubmitTicket />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin */}
        <Route
          path="/ticket-queue"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ticket/:id"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}