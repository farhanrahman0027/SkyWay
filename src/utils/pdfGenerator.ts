import { jsPDF } from 'jspdf';

interface TicketData {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  passengerName: string;
  status: string;
  bookingDate: string;
  totalAmount: number;
}

export const generateTicketPDF = (ticketData: TicketData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set background color
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Add header with logo placeholder
  doc.setFillColor(0, 71, 171); // #0047AB
  doc.rect(0, 0, 210, 35, 'F');
  
  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('SkyWay', 20, 20);
  
  doc.setFontSize(12);
  doc.text('E-Ticket / Boarding Pass', 20, 28);
  
  // Add ticket number
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Booking Reference: ${ticketData.id.substring(0, 8).toUpperCase()}`, 20, 45);
  
  // Horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 50, 190, 50);
  
  // Flight details section
  doc.setFontSize(16);
  doc.setTextColor(0, 71, 171);
  doc.text('Flight Details', 20, 60);
  
  // Airline and Flight Number
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`${ticketData.airline} - ${ticketData.flightNumber}`, 20, 70);
  
  // Status
  doc.setFontSize(10);
  if (ticketData.status === 'confirmed') {
    doc.setTextColor(0, 128, 0);
    doc.text('CONFIRMED', 150, 70);
  } else if (ticketData.status === 'cancelled') {
    doc.setTextColor(255, 0, 0);
    doc.text('CANCELLED', 150, 70);
  } else {
    doc.setTextColor(100, 100, 100);
    doc.text('COMPLETED', 150, 70);
  }
  
  // From-To Details with departure date
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`From: ${ticketData.from}`, 20, 85);
  doc.text(`To: ${ticketData.to}`, 20, 95);
  
  const formattedDate = new Date(ticketData.date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  doc.text(`Date: ${formattedDate}`, 20, 105);
  doc.text(`Departure: ${ticketData.departureTime}`, 20, 115);
  doc.text(`Arrival: ${ticketData.arrivalTime}`, 20, 125);
  
  // Passenger Information
  doc.setFontSize(16);
  doc.setTextColor(0, 71, 171);
  doc.text('Passenger Information', 20, 145);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${ticketData.passengerName}`, 20, 155);
  
  // Payment Information
  doc.setFontSize(16);
  doc.setTextColor(0, 71, 171);
  doc.text('Payment Information', 20, 175);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Amount: ₹${ticketData.totalAmount.toLocaleString()}`, 20, 185);
  doc.text(`Booking Date: ${new Date(ticketData.bookingDate).toLocaleDateString()}`, 20, 195);
  
  // Boarding Instructions
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 210, 170, 50, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(0, 71, 171);
  doc.text('Boarding Instructions', 25, 220);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('1. Please arrive at the airport at least 2 hours before departure.', 25, 230);
  doc.text('2. Carry a valid ID proof along with this e-ticket.', 25, 240);
  doc.text('3. Check-in counters close 45 minutes before departure.', 25, 250);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is a computer-generated document. No signature required.', 20, 280);
  doc.text('For any assistance, please contact SkyWay customer support.', 20, 285);
  
  // Save the PDF
  doc.save(`SkyWay-Ticket-${ticketData.id.substring(0, 8).toUpperCase()}.pdf`);
};