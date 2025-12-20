import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function POST(req: Request) {
  try {
    const { ticket, schedule } = await req.json();

    // Generate PDF HTML content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #4f46e5;
      margin: 0;
      font-size: 28px;
    }
    .ticket-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-section {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
    }
    .info-section h3 {
      margin: 0 0 10px 0;
      color: #1e293b;
      font-size: 14px;
      text-transform: uppercase;
    }
    .info-section p {
      margin: 5px 0;
      color: #475569;
    }
    .seat-info {
      background: #eef2ff;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .seat-number {
      font-size: 48px;
      font-weight: bold;
      color: #4f46e5;
      margin: 10px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    .ticket-number {
      background: #1e293b;
      color: white;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
      margin: 20px 0;
      font-family: monospace;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>BUS TICKET</h1>
    <p>${schedule.company?.name || "Transport Management System"}</p>
  </div>

  <div class="ticket-number">
    Ticket Number: ${ticket.ticketNumber}
  </div>

  <div class="ticket-info">
    <div class="info-section">
      <h3>Passenger Information</h3>
      <p><strong>Name:</strong> ${ticket.passengerName}</p>
      <p><strong>Phone:</strong> ${ticket.passengerPhone}</p>
      ${ticket.passengerEmail ? `<p><strong>Email:</strong> ${ticket.passengerEmail}</p>` : ""}
      ${ticket.passengerNID ? `<p><strong>NID:</strong> ${ticket.passengerNID}</p>` : ""}
    </div>

    <div class="info-section">
      <h3>Trip Details</h3>
      <p><strong>Route:</strong> ${schedule.route?.name || "N/A"}</p>
      <p><strong>Bus:</strong> ${schedule.bus?.number || "N/A"} (${schedule.bus?.type || "N/A"})</p>
      <p><strong>Departure:</strong> ${dayjs(schedule.departureTime).format("MMM D, YYYY h:mm A")}</p>
      <p><strong>Arrival:</strong> ${dayjs(schedule.arrivalTime).format("MMM D, YYYY h:mm A")}</p>
      ${ticket.boardingPoint ? `<p><strong>Boarding:</strong> ${typeof ticket.boardingPoint === "object" ? ticket.boardingPoint.name : ticket.boardingPoint}</p>` : ""}
      ${ticket.droppingPoint ? `<p><strong>Dropping:</strong> ${typeof ticket.droppingPoint === "object" ? ticket.droppingPoint.name : ticket.droppingPoint}</p>` : ""}
    </div>
  </div>

  <div class="seat-info">
    <p style="margin: 0; color: #64748b;">Seat Numbers</p>
    <div class="seat-number">${ticket.seats.map((s: any) => s.seatName || s.seatNumber).join(", ")}</div>
    <p style="margin: 0; color: #64748b;">Total Fare: ৳${ticket.totalFare}</p>
    ${ticket.discount > 0 ? `<p style="margin: 5px 0; color: #64748b;">Discount (${ticket.discount}%): -৳${ticket.discountAmount.toFixed(2)}</p>` : ""}
    <p style="margin: 5px 0; color: #1e293b; font-weight: bold;">Final Amount: ৳${ticket.finalAmount.toFixed(2)}</p>
  </div>

  <div class="footer">
    <p>Booking Date: ${dayjs(ticket.bookingDate).format("MMM D, YYYY h:mm A")}</p>
    <p>Status: ${ticket.status}</p>
    <p style="margin-top: 20px;">Please arrive at least 15 minutes before departure time.</p>
  </div>
</body>
</html>
    `;

    // For now, return HTML that can be converted to PDF on the client side
    // In production, you might want to use a server-side PDF library like puppeteer or pdfkit
    return NextResponse.json({ html: htmlContent });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: error.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

