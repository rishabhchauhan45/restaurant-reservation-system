import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineSparkles } from 'react-icons/hi';
import BookingForm from '../components/reservation/BookingForm';

const BookReservation = () => {
  const [lastBooking, setLastBooking] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <HiOutlineCalendar className="w-7 h-7 text-dark-950" />
          </div>
          <h1 className="section-title">Book a Table</h1>
          <p className="section-subtitle">Select your preferred date, time, and party size</p>
        </div>

        {/* Booking Form Card */}
        <div className="glass-strong rounded-2xl p-8 mb-6">
          <BookingForm onSuccess={setLastBooking} />
        </div>

        {/* Success Confirmation */}
        {lastBooking && (
          <div className="card border-emerald-500/20 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HiOutlineSparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-400 mb-1">Reservation Confirmed!</h3>
                <div className="space-y-1 text-sm text-dark-300">
                  <p>
                    <span className="text-dark-500">Table:</span> #{lastBooking.table?.tableNumber} ({lastBooking.table?.capacity} seats)
                  </p>
                  <p>
                    <span className="text-dark-500">Date:</span> {formatDate(lastBooking.reservationDate)}
                  </p>
                  <p>
                    <span className="text-dark-500">Time:</span> {lastBooking.timeSlot}
                  </p>
                  <p>
                    <span className="text-dark-500">Guests:</span> {lastBooking.guests}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReservation;
