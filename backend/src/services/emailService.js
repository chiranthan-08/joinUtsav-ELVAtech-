const sgMail = require('@sendgrid/mail');
const store = require('../data/inMemoryStore');

// Configure SendGrid API Key if present
const sendgridApiKey = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'notifications@utsavmitra.com';
const FROM_NAME = 'UtsavMitra Celebrations';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@utsavmitra.com';
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_NOTIFICATION_EMAIL || 'superadmin@utsavmitra.com';

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
  console.log('[SendGrid Service]: API Key configured and active.');
} else {
  console.log('[SendGrid Service]: No SENDGRID_API_KEY detected in .env. Operating in resilient simulation & audit ledger mode.');
}

// Common festive HTML email wrapper
function getEmailWrapper(title, preheader, contentHtml) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #0f172a; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%); padding: 30px 20px; text-align: center; }
    .logo { font-size: 32px; margin-bottom: 5px; }
    .brand-name { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; margin: 0; }
    .tagline { color: #fed7aa; font-size: 12px; margin-top: 4px; font-weight: 500; }
    .body-content { padding: 30px 25px; }
    .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #334155; font-size: 13px; }
    .info-label { color: #94a3b8; font-weight: 500; }
    .info-value { color: #ffffff; font-weight: 700; text-align: right; }
    .btn { display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #e11d48 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 15px; }
    .footer { background-color: #090d16; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: rgba(234, 88, 12, 0.2); color: #fb923c; border: 1px solid rgba(234, 88, 12, 0.4); }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="container">
    <div class="header">
      <div class="logo">🪔</div>
      <h1 class="brand-name">UtsavMitra</h1>
      <div class="tagline"> उत्सवमित्र • AI-Powered Celebrations Platform</div>
    </div>
    <div class="body-content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">This email was sent by <strong>UtsavMitra Automated Verification Engine</strong>.</p>
      <p style="margin: 0;">Secured with SendGrid Email Dispatch &amp; Encrypted QR Pass Validation &bull; India</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Universal Send Method via SendGrid with automatic fallback logging
 */
async function sendEmail({ to, subject, html, text, type = 'NOTIFICATION', metadata = {} }) {
  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME
    },
    subject,
    text: text || subject,
    html
  };

  let dispatchStatus = 'SIMULATED';
  let errorDetail = null;

  if (sendgridApiKey) {
    try {
      const response = await sgMail.send(msg);
      dispatchStatus = 'SENT';
      console.log(`[SendGrid Success]: Email delivered to ${to} (${subject}). Status: ${response[0]?.statusCode}`);
    } catch (err) {
      errorDetail = err.response?.body?.errors || err.message;
      dispatchStatus = 'FAILED_FALLBACK_LOGGED';
      console.warn(`[SendGrid Notice]: Unable to send via public API:`, errorDetail);
    }
  } else {
    console.log(`[SendGrid Simulation]: Dispatched email to ${to} -> Subject: "${subject}"`);
  }

  // Record into platform email ledger for Admin & audit purposes
  const loggedEmail = store.logEmail({
    to,
    from: FROM_EMAIL,
    subject,
    type,
    dispatchStatus,
    provider: sendgridApiKey ? 'SendGrid API' : 'SendGrid Simulator',
    error: errorDetail,
    metadata
  });

  return {
    success: true,
    dispatchStatus,
    emailId: loggedEmail._id
  };
}

/**
 * 1. Booking Confirmation & Payment Verification Emails
 * Dispatches to: User (Attendee), Organizer, Admin, Super Admin
 */
async function sendBookingConfirmationEmails({ booking, event }) {
  const portalUrl = 'http://localhost:5173';
  const passUrl = `${portalUrl}/pass/${booking.passId}`;
  const totalInr = `₹${(booking.totalAmount || 0).toLocaleString('en-IN')}`;

  // A. Attendee / User Verification Email
  const userHtml = getEmailWrapper(
    `Booking Confirmed – ${event.title}`,
    `Your pass #${booking.passId} is ready for ${event.title}`,
    `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge">TICKETS CONFIRMED</span>
        <h2 style="color: #ffffff; margin: 12px 0 6px 0; font-size: 20px;">Namaste, ${booking.userName}! 🙏</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">Your pass for <strong>${event.title}</strong> has been successfully booked and paid.</p>
      </div>

      <div class="card">
        <div style="font-size: 14px; font-weight: bold; color: #fb923c; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 8px;">
          🎟️ Digital Pass &amp; Entry Credentials
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Pass ID:</td>
            <td style="padding: 6px 0; color: #38bdf8; font-weight: bold; text-align: right; font-family: monospace;">${booking.passId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Celebration:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${event.title}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Date &amp; Time:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${event.date} at ${event.time}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Venue:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${event.venueName}, ${event.city}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Ticket Tier:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${booking.ticketTier} (${booking.quantity} Pass${booking.quantity > 1 ? 'es' : ''})</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Total Paid:</td>
            <td style="padding: 6px 0; color: #34d399; font-weight: bold; font-size: 15px; text-align: right;">${totalInr}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Razorpay Ref:</td>
            <td style="padding: 6px 0; color: #cbd5e1; font-family: monospace; text-align: right; font-size: 11px;">${booking.razorpayPaymentId}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0 15px 0;">
        <a href="${passUrl}" class="btn">View &amp; Download Digital QR Pass</a>
      </div>

      <div style="background-color: #1e293b; border-radius: 8px; padding: 12px; margin-top: 15px; font-size: 12px; color: #94a3b8; text-align: center;">
        ⚡ <strong>Gate Entry Tip:</strong> Keep your digital QR pass ready on your phone or print a physical copy. Our organizers will scan it instantly at the entrance gates.
      </div>
    `
  );

  // Send to Attendee
  await sendEmail({
    to: booking.userEmail,
    subject: `🎉 Booking Confirmed! Your UtsavMitra Pass #${booking.passId} (${event.title})`,
    html: userHtml,
    type: 'USER_BOOKING_VERIFICATION',
    metadata: { passId: booking.passId, eventId: event._id, totalAmount: booking.totalAmount }
  });

  // B. Event Organizer Alert Email
  const organizerHtml = getEmailWrapper(
    `New Attendee Booked – ${event.title}`,
    `New attendee registration from ${booking.userName}`,
    `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4);">NEW TICKET SALE</span>
        <h2 style="color: #ffffff; margin: 12px 0 6px 0; font-size: 20px;">Hello, ${event.organizerName}! 📋</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">A new attendee has purchased tickets for your celebration: <strong>${event.title}</strong>.</p>
      </div>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Guest Name:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${booking.userName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Email &amp; Phone:</td>
            <td style="padding: 6px 0; color: #cbd5e1; text-align: right;">${booking.userEmail} ${booking.userPhone ? ' | ' + booking.userPhone : ''}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Tier &amp; Qty:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${booking.quantity}x ${booking.ticketTier}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Pass ID:</td>
            <td style="padding: 6px 0; color: #38bdf8; font-family: monospace; font-weight: bold; text-align: right;">${booking.passId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Total Revenue:</td>
            <td style="padding: 6px 0; color: #34d399; font-weight: bold; font-size: 15px; text-align: right;">${totalInr}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0 15px 0;">
        <a href="${portalUrl}/organizer/events/${event._id}/attendees" class="btn">View Event Attendee Roster</a>
      </div>
    `
  );

  await sendEmail({
    to: event.organizerEmail || 'organizer@utsavmitra.com',
    subject: `🎟️ New Booking Received: ${booking.quantity}x ${booking.ticketTier} for ${event.title}`,
    html: organizerHtml,
    type: 'ORGANIZER_SALE_ALERT',
    metadata: { passId: booking.passId, eventId: event._id, organizerEmail: event.organizerEmail }
  });

  // C. Admin & Super Admin Financial / Audit Alert
  const commission = (booking.totalAmount * 0.05).toFixed(2);
  const adminHtml = getEmailWrapper(
    `Platform Transaction Ledger – ${event.title}`,
    `Transaction of ${totalInr} recorded on UtsavMitra`,
    `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border-color: rgba(99, 102, 241, 0.4);">ADMIN FINANCIAL RECORD</span>
        <h2 style="color: #ffffff; margin: 12px 0 6px 0; font-size: 20px;">Financial Audit Alert 📊</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">A verified ticket transaction has been processed and logged on UtsavMitra.</p>
      </div>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Event Title:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${event.title}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Organizer:</td>
            <td style="padding: 6px 0; color: #cbd5e1; text-align: right;">${event.organizerName} (${event.organizerEmail})</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Buyer:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${booking.userName} (${booking.userEmail})</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Pass ID:</td>
            <td style="padding: 6px 0; color: #38bdf8; font-family: monospace; text-align: right;">${booking.passId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Gross Volume:</td>
            <td style="padding: 6px 0; color: #34d399; font-weight: bold; text-align: right;">${totalInr}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Platform Fee (5%):</td>
            <td style="padding: 6px 0; color: #facc15; font-weight: bold; text-align: right;">₹${commission}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Gateway Payment ID:</td>
            <td style="padding: 6px 0; color: #cbd5e1; font-family: monospace; text-align: right; font-size: 11px;">${booking.razorpayPaymentId}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0 15px 0;">
        <a href="${portalUrl}/super-admin/dashboard" class="btn">View Super Admin GMV &amp; Audit Logs</a>
      </div>
    `
  );

  // Send to Admin
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `📊 [Admin Alert] Ticket Sale: ${totalInr} for ${event.title} (Pass #${booking.passId})`,
    html: adminHtml,
    type: 'ADMIN_FINANCIAL_ALERT',
    metadata: { passId: booking.passId, grossAmount: booking.totalAmount, commission }
  });

  // Send to Super Admin
  await sendEmail({
    to: SUPERADMIN_EMAIL,
    subject: `👑 [Super Admin HQ] GMV Transaction: ${totalInr} for ${event.title}`,
    html: adminHtml,
    type: 'SUPERADMIN_GMV_ALERT',
    metadata: { passId: booking.passId, grossAmount: booking.totalAmount, commission }
  });
}

/**
 * 2. Event Creation & Listing Notification Emails
 * Dispatches to: Organizer, Admin, Super Admin
 */
async function sendEventCreatedEmails({ event, organizer }) {
  const portalUrl = 'http://localhost:5173';
  const eventUrl = `${portalUrl}/events/${event._id}`;

  // A. Organizer Event Confirmation Email
  const organizerHtml = getEmailWrapper(
    `Event Created – ${event.title}`,
    `Your event ${event.title} is live on UtsavMitra`,
    `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge" style="background: rgba(249, 115, 22, 0.2); color: #fb923c; border-color: rgba(249, 115, 22, 0.4);">EVENT LISTED</span>
        <h2 style="color: #ffffff; margin: 12px 0 6px 0; font-size: 20px;">Celebration Live! 🪔</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">Congratulations ${organizer.name}! Your event <strong>${event.title}</strong> is published.</p>
      </div>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Title:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${event.title}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Category:</td>
            <td style="padding: 6px 0; color: #38bdf8; text-align: right;">${event.category}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Date &amp; Time:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${event.date} (${event.time})</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Venue:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${event.venueName}, ${event.city}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Capacity:</td>
            <td style="padding: 6px 0; color: #34d399; font-weight: bold; text-align: right;">${event.totalCapacity || 500} Attendees</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0 15px 0;">
        <a href="${eventUrl}" class="btn">View Public Event Listing</a>
      </div>
    `
  );

  await sendEmail({
    to: organizer.email,
    subject: `🪔 Event Listed Successfully: ${event.title} on UtsavMitra`,
    html: organizerHtml,
    type: 'ORGANIZER_EVENT_CREATED',
    metadata: { eventId: event._id }
  });

  // B. Admin & Super Admin Alert
  const adminHtml = getEmailWrapper(
    `New Event Submission – ${event.title}`,
    `New event created by ${organizer.name}`,
    `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border-color: rgba(99, 102, 241, 0.4);">NEW EVENT CREATED</span>
        <h2 style="color: #ffffff; margin: 12px 0 6px 0; font-size: 20px;">Platform Event Alert 🏛️</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">An organizer has published a new celebration on UtsavMitra.</p>
      </div>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Event:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${event.title}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Organizer:</td>
            <td style="padding: 6px 0; color: #cbd5e1; text-align: right;">${organizer.name} (${organizer.email})</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Location:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${event.venueName}, ${event.city}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Date:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${event.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Status:</td>
            <td style="padding: 6px 0; color: #34d399; font-weight: bold; text-align: right;">${event.status.toUpperCase()}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0 15px 0;">
        <a href="${portalUrl}/admin/dashboard" class="btn">Open Admin Events Registry</a>
      </div>
    `
  );

  // Send to Admin & Super Admin
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `✨ [Admin Alert] New Event Published: ${event.title} (${event.city})`,
    html: adminHtml,
    type: 'ADMIN_EVENT_NOTIFICATION',
    metadata: { eventId: event._id }
  });

  await sendEmail({
    to: SUPERADMIN_EMAIL,
    subject: `👑 [Super Admin HQ] New Event Created: ${event.title}`,
    html: adminHtml,
    type: 'SUPERADMIN_EVENT_NOTIFICATION',
    metadata: { eventId: event._id }
  });
}

/**
 * Send welcome & account verification email upon registration
 */
async function sendUserRegistrationEmail({ user }) {
  const isOrganizer = user.role === 'organizer';
  const roleLabel = isOrganizer ? 'Event Organizer' : 'Celebration Guest / User';
  const portalUrl = 'http://localhost:5173';

  const userHtml = getEmailWrapper(
    `Welcome to UtsavMitra, ${user.name}!`,
    `Your ${roleLabel} account is now verified and active.`,
    `
      <div style="text-align: center; margin-bottom: 25px;">
        <span class="badge">Account Verified &bull; ${roleLabel.toUpperCase()}</span>
        <h2 style="color: #ffffff; margin: 15px 0 5px 0; font-size: 22px;">Namaste, ${user.name}! 🙏</h2>
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          Welcome to <strong>UtsavMitra</strong> – India's premier AI-powered event management platform for weddings, cultural festivals, college fests, and celebrations.
        </p>
      </div>

      <div class="card">
        <h3 style="color: #fb923c; font-size: 15px; margin: 0 0 15px 0; border-bottom: 1px solid #334155; padding-bottom: 8px;">
          🪔 Your Account Profile &amp; Credentials
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 8px 0; color: #94a3b8;">Full Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold; text-align: right;">${user.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 8px 0; color: #94a3b8;">Registered Email:</td>
            <td style="padding: 8px 0; color: #38bdf8; font-weight: bold; text-align: right;">${user.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 8px 0; color: #94a3b8;">Assigned Role:</td>
            <td style="padding: 8px 0; color: #34d399; font-weight: bold; text-align: right;">${roleLabel}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 8px 0; color: #94a3b8;">Contact Phone:</td>
            <td style="padding: 8px 0; color: #cbd5e1; text-align: right;">${user.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">City:</td>
            <td style="padding: 8px 0; color: #cbd5e1; text-align: right;">${user.city || 'India'}</td>
          </tr>
        </table>
      </div>

      <div style="background: rgba(234, 88, 12, 0.1); border: 1px dashed rgba(234, 88, 12, 0.4); border-radius: 12px; padding: 15px; margin: 20px 0; font-size: 13px; color: #fdba74;">
        <strong style="color: #fb923c;">✨ What you can do next:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
          ${isOrganizer 
            ? `
              <li>List your weddings, cultural shows, college fests, or concerts</li>
              <li>Configure customized ticket tiers with Razorpay payment processing</li>
              <li>Scan attendee passes at entry gates using our QR-code scanner</li>
            `
            : `
              <li>Explore verified celebrations and cultural events across Indian cities</li>
              <li>Book tickets securely via Razorpay with instant digital passes</li>
              <li>Consult our AI Celebration Assistant anytime for ritual planning &amp; venue guidance</li>
            `
          }
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0 15px 0;">
        <a href="${portalUrl}${isOrganizer ? '/organizer/dashboard' : '/events'}" class="btn">
          ${isOrganizer ? 'Open Organizer Console &rarr;' : 'Explore Upcoming Celebrations &rarr;'}
        </a>
      </div>
    `
  );

  // Send to the registered user
  await sendEmail({
    to: user.email,
    subject: `🪔 Welcome to UtsavMitra! Your Account is Verified (${user.name})`,
    html: userHtml,
    type: 'USER_REGISTRATION_VERIFICATION',
    metadata: { userId: user._id, role: user.role }
  });

  // Admin notification
  const adminHtml = getEmailWrapper(
    `New User Registered: ${user.name}`,
    `New ${user.role} registration on UtsavMitra platform.`,
    `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge">Platform Security Notice</span>
        <h2 style="color: #ffffff; margin: 15px 0 5px 0; font-size: 20px;">New Account Registered</h2>
        <p style="color: #94a3b8; font-size: 13px;">A new ${user.role} has signed up on UtsavMitra.</p>
      </div>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">User Name:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${user.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Email:</td>
            <td style="padding: 6px 0; color: #38bdf8; text-align: right;">${user.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">Role:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${user.role}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 6px 0; color: #94a3b8;">City:</td>
            <td style="padding: 6px 0; color: #ffffff; text-align: right;">${user.city || 'India'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">Phone:</td>
            <td style="padding: 6px 0; color: #cbd5e1; text-align: right;">${user.phone || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0 15px 0;">
        <a href="${portalUrl}/admin/dashboard" class="btn">View Users in Admin Console</a>
      </div>
    `
  );

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `👤 [Admin Alert] New ${user.role.toUpperCase()} Registered: ${user.name} (${user.email})`,
    html: adminHtml,
    type: 'ADMIN_USER_REGISTERED_ALERT',
    metadata: { userId: user._id }
  });

  await sendEmail({
    to: SUPERADMIN_EMAIL,
    subject: `👑 [Super Admin HQ] Account Created: ${user.name} (${user.role})`,
    html: adminHtml,
    type: 'SUPERADMIN_USER_REGISTERED_ALERT',
    metadata: { userId: user._id }
  });
}

module.exports = {
  sendEmail,
  sendBookingConfirmationEmails,
  sendEventCreatedEmails,
  sendUserRegistrationEmail
};

