import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function POST(req: Request) {
  try {
    const { ticket, schedule } = await req.json();

    // Generate PDF HTML content with modern, professional design
    const companyName = schedule.company?.name || "Transport Management System";
    const routeName = schedule.route?.name || "N/A";
    const fromLocation = typeof schedule.route?.from === "object" ? schedule.route.from.name : schedule.route?.from || "N/A";
    const toLocation = typeof schedule.route?.to === "object" ? schedule.route.to.name : schedule.route?.to || "N/A";
    const boardingPoint = ticket.boardingPoint ? (typeof ticket.boardingPoint === "object" ? ticket.boardingPoint.name : ticket.boardingPoint) : fromLocation;
    const droppingPoint = ticket.droppingPoint ? (typeof ticket.droppingPoint === "object" ? ticket.droppingPoint.name : ticket.droppingPoint) : toLocation;
    const seatNumbers = ticket.seats.map((s: any) => s.seatName || `Seat ${s.seatNumber}`).join(", ");
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: white;
      padding: 0;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
    }
    .ticket-container {
      width: 100%;
      background: white;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .ticket-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      text-align: center;
      position: relative;
    }
    .ticket-header::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 0;
      right: 0;
      height: 24px;
      background: white;
      border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    }
    .company-logo {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      margin: 0 auto 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .ticket-header h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 4px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .ticket-header .company-name {
      font-size: 14px;
      opacity: 0.95;
      font-weight: 500;
    }
    .ticket-number-badge {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 6px 16px;
      border-radius: 20px;
      display: inline-block;
      margin-top: 8px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .ticket-body {
      padding: 20px 15px 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 15px;
    }
    .info-card {
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px;
      border-left: 3px solid #667eea;
    }
    .info-card h3 {
      color: #667eea;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .info-card p {
      margin: 4px 0;
      color: #1e293b;
      font-size: 11px;
      line-height: 1.4;
    }
    .info-card strong {
      color: #475569;
      font-weight: 600;
      display: inline-block;
      min-width: 70px;
      font-size: 10px;
    }
    .route-section {
      background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
      border-radius: 10px;
      padding: 12px;
      margin: 12px 0;
      text-align: center;
      border: 2px dashed #667eea;
    }
    .route-arrow {
      font-size: 20px;
      color: #667eea;
      margin: 6px 0;
    }
    .route-from, .route-to {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin: 4px 0;
    }
    .route-name {
      color: #667eea;
      font-size: 12px;
      font-weight: 600;
      margin-top: 4px;
    }
    .seats-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      padding: 15px;
      margin: 12px 0;
      color: white;
      text-align: center;
    }
    .seats-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: 0.9;
      margin-bottom: 6px;
    }
    .seat-numbers {
      font-size: 28px;
      font-weight: 700;
      margin: 8px 0;
      letter-spacing: 1px;
    }
    .fare-details {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 12px;
      margin-top: 10px;
    }
    .fare-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 11px;
    }
    .fare-row:last-child {
      border-bottom: none;
      border-top: 2px solid rgba(255, 255, 255, 0.3);
      margin-top: 6px;
      padding-top: 8px;
      font-size: 16px;
      font-weight: 700;
    }
    .fare-label {
      opacity: 0.9;
    }
    .fare-value {
      font-weight: 600;
    }
    .trip-details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin: 12px 0;
    }
    .detail-item {
      background: #f8fafc;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
    }
    .detail-label {
      font-size: 9px;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .detail-value {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }
    .barcode-section {
      background: #1e293b;
      color: white;
      padding: 12px;
      text-align: center;
      margin-top: 12px;
    }
    .barcode {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      letter-spacing: 2px;
      margin: 8px 0;
      font-weight: 600;
    }
    .barcode-label {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: 0.7;
      margin-top: 4px;
    }
    .footer {
      background: #f8fafc;
      padding: 12px;
      text-align: center;
      border-top: 2px solid #e2e8f0;
      margin-top: 12px;
    }
    .footer-text {
      color: #64748b;
      font-size: 9px;
      line-height: 1.5;
    }
    .footer-text p {
      margin: 4px 0;
    }
    .footer-text strong {
      color: #1e293b;
    }
    .status-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e2e8f0, transparent);
      margin: 12px 0;
    }
    @media print {
      body {
        background: white;
        padding: 0;
        width: 210mm;
        min-height: 297mm;
      }
      .ticket-container {
        box-shadow: none;
        border-radius: 0;
      }
      @page {
        margin: 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="ticket-container">
    <!-- Header -->
    <div class="ticket-header">
      <div class="company-logo">${companyName.charAt(0).toUpperCase()}</div>
      <h1>BUS TICKET</h1>
      <div class="company-name">${companyName}</div>
      <div class="ticket-number-badge">${ticket.ticketNumber}</div>
    </div>

    <!-- Body -->
    <div class="ticket-body">
      <!-- Passenger Information -->
      <div class="info-grid">
        <div class="info-card">
          <h3>Passenger Details</h3>
          <p><strong>Name:</strong> ${ticket.passengerName}</p>
          <p><strong>Phone:</strong> ${ticket.passengerPhone}</p>
          ${ticket.passengerEmail ? `<p><strong>Email:</strong> ${ticket.passengerEmail}</p>` : ""}
          ${ticket.passengerNID ? `<p><strong>NID:</strong> ${ticket.passengerNID}</p>` : ""}
        </div>

        <div class="info-card">
          <h3>Journey Details</h3>
          <p><strong>Bus:</strong> ${schedule.bus?.number || "N/A"}</p>
          <p><strong>Type:</strong> ${schedule.bus?.type || "N/A"}</p>
          <p><strong>Date:</strong> ${dayjs(schedule.departureTime).format("MMM D, YYYY")}</p>
          <p><strong>Status:</strong> <span class="status-badge">${ticket.status}</span></p>
        </div>
      </div>

      <!-- Route Section -->
      <div class="route-section">
        <div class="route-from">${fromLocation}</div>
        <div class="route-arrow">↓</div>
        <div class="route-to">${toLocation}</div>
        <div class="route-name">${routeName}</div>
      </div>

      <!-- Trip Details Grid -->
      <div class="trip-details-grid">
        <div class="detail-item">
          <div class="detail-label">Departure Time</div>
          <div class="detail-value">${dayjs(schedule.departureTime).format("h:mm A")}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Arrival Time</div>
          <div class="detail-value">${dayjs(schedule.arrivalTime).format("h:mm A")}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Boarding Point</div>
          <div class="detail-value">${boardingPoint}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Dropping Point</div>
          <div class="detail-value">${droppingPoint}</div>
        </div>
      </div>

      <!-- Seats Section -->
      <div class="seats-section">
        <div class="seats-label">Seat Numbers</div>
        <div class="seat-numbers">${seatNumbers}</div>
        <div class="fare-details">
          <div class="fare-row">
            <span class="fare-label">Total Fare</span>
            <span class="fare-value">৳${ticket.totalFare.toLocaleString()}</span>
          </div>
          ${ticket.discount > 0 ? `
          <div class="fare-row">
            <span class="fare-label">Discount (${ticket.discount}%)</span>
            <span class="fare-value">-৳${ticket.discountAmount.toFixed(2)}</span>
          </div>
          ` : ""}
          <div class="fare-row">
            <span class="fare-label">Final Amount</span>
            <span class="fare-value">৳${ticket.finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Barcode Section -->
      <div class="barcode-section">
        <div class="barcode">${ticket.ticketNumber.replace(/-/g, ' ')}</div>
        <div class="barcode-label">Ticket Reference Number</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        <p><strong>Booking Date:</strong> ${dayjs(ticket.bookingDate).format("MMMM D, YYYY [at] h:mm A")}</p>
        <p style="margin-top: 15px;">Please arrive at least <strong>15 minutes</strong> before the scheduled departure time.</p>
        <p style="margin-top: 10px;">Keep this ticket safe and present it at the boarding point.</p>
        <p style="margin-top: 10px; font-size: 10px; opacity: 0.7;">This is a computer-generated ticket. No signature required.</p>
      </div>
    </div>
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

