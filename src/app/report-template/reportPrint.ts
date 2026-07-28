export interface ReceiptItem {
  seqNo: number | string;
  transactionNo: string;
  customerName: string;
  description: string;
  currency: string;
  amount: number | string;
}

export interface ReceiptData {
  receiptNo?: string;
  txtTitle?: string;
  receiptDate?: string;
  paymentMethod?: string;
  customerName?: string;
  customerAddress?: string;
  txtUserID?: string;
  printedDate?: string;
  printedTime?: string;
  txtTotal?: string | number;
  details?: ReceiptItem[];
}

export const reportPrint = (data?: ReceiptData): string => {
  const receiptNo = data?.receiptNo || '';
  const title = data?.txtTitle || '';
  const receiptDate = data?.receiptDate || '';
  const paymentMethod = data?.paymentMethod || '';
  const userId = (data?.txtUserID || '').toUpperCase();
  const printedDate = data?.printedDate || new Date().toLocaleDateString();
  const printedTime =
    data?.printedTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const grandTotal = data?.txtTotal || '0.00';

  const baseUrl = window.location.origin;

  const detailsList: ReceiptItem[] = data?.details && data.details.length > 0 ? data.details : [];

  const tableRows = detailsList
    .map(
      (item, index) => `
    <tr class="table-row ${index % 2 === 0 ? 'even-row' : ''}">
      <td style="width: 6%; text-align: center; font-weight: 500; color: #64748b;">${item.seqNo}</td>
      <td style="width: 18%; font-weight: 600; color: #0f172a;">${item.transactionNo}</td>
      <td style="width: 26%; font-weight: 600; color: #0f172a;">${item.customerName}</td>
      <td style="width: 28%; color: #334155;">${item.description}</td>
      <td style="width: 7%; color: #64748b; font-weight: 500; text-align: center;">${item.currency}</td>
      <td style="width: 15%; text-align: right; font-weight: 600; color: #0f172a;">${item.amount}</td>
    </tr>
  `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt - ${receiptNo}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 11px;
          color: #1e293b;
          letter-spacing: 1px;
        }

        .page-container {
          min-height: 297mm;
          padding: 5mm 10mm;
          background: #ffffff;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .content-wrap {
          flex: 1;
        }

        .header-table {
          width: 100%;
          border-collapse: collapse;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        
        .brand-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 8px;
          background: #ffffff;
          overflow: hidden;
          vertical-align: middle;
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .company-name {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
         letter-spacing: 1px;
        }

        .company-details {
          font-size: 10px;
          color: #64748b;
          line-height: 1.4;
          margin-top: 2px;
        }

        .receipt-banner {
          display: table;
          width: 100%;
          margin-bottom: 20px;
        }
        .banner-left {
          display: table-cell;
          vertical-align: middle;
          letter-spacing: 1px;

        }
        .banner-right {
          display: table-cell;
          text-align: right;
          vertical-align: middle;
        }

        .doc-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.5px;
        }

        .paid-badge {
          display: inline-block;
          background-color: #10b981;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-grid {
          display: table;
          width: 40%;
          margin-bottom: 20px;
          border-spacing: 0;
        }
        .info-col {
          display: table-cell;
          width: 50%;
          vertical-align: top;
        }
        .card-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 14px;
          height: 100%;
        }

        .card-title {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .meta-row {
          margin-bottom: 4px;
          font-size: 11px;
        }
        .meta-row strong {
          color: #0f172a;
        }

        .table-container {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-bottom: 20px;
        }
        .table-container th {
          background-color: #0f172a;
          color: #ffffff;
          padding: 8px 10px;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          word-wrap: break-word;
        }
        .table-row td {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
          word-wrap: break-word;
        }
        .table-row.even-row {
          background-color: #f8fafc;
        }

        .summary-wrapper {
          display: table;
          width: 100%;
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .summary-right {
          display: table-cell;
          text-align: right;
          width: 40%;
        }
        .summary-table {
          width: 100%;
          border-collapse: collapse;
        }
        .summary-table td {
          padding: 6px 10px;
          font-size: 11px;
        }
        .total-row td {
          border-top: 2px solid #0f172a;
          border-bottom: 2px solid #0f172a;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          padding: 8px 10px;
        }

        .footer-section {
          page-break-inside: avoid;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px dashed #cbd5e1;
        }
        .footer-table {
          width: 100%;
          display: table;
        }
        .meta-info {
          display: table-cell;
          vertical-align: bottom;
          font-size: 10px;
          color: #64748b;
          line-height: 1.5;
        }
        .signature-box {
          display: table-cell;
          width: 200px;
          text-align: center;
          vertical-align: bottom;
        }
        .signature-line {
          border-bottom: 1px solid #0f172a;
          margin-bottom: 6px;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            width: 210mm;
            height: 297mm;
          }
          .page-container {
            width: 100%;
            height: 100%;
            padding: 10mm 12mm;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>

      <div class="page-container">
        <div class="content-wrap">
          <table class="header-table">
            <tr>
              <td style="width: 50%;">
                <div class="brand-badge">
                  <img src="${baseUrl}/asset/images/logo.png" alt="SSL Logo" class="brand-logo-img">
                </div>
                <div style="display: inline-block; vertical-align: middle; margin-left: 10px;">
                  <div class="company-name">SAMUDERA SHIPPING LINE LTD</div>
                  <div class="company-details">Reg No: 199308462C</div>
                </div>
              </td>
              <td style="width: 50%; text-align: right; vertical-align: top;">
                <div class="company-details">
                  6 Raffles Quay #25-01, Singapore 048580<br>
                  TEL: 6532 3688 &nbsp;|&nbsp; FAX: 6534 1310
                </div>
              </td>
            </tr>
          </table>
          <div class="receipt-banner">
            <div class="banner-left">
              <div class="doc-title">${title}</div>
            </div>
            <div class="banner-right">
              <span class="paid-badge">✔ PAYMENT RECEIVED</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-col" style="padding-left: 8px;">
              <div class="card-box">
                <div class="card-title">Payment Info</div>
                <div class="meta-row">Receipt No : <strong>${receiptNo}</strong></div>
                <div class="meta-row">Payment Date : <strong>${receiptDate}</strong></div>
                <div class="meta-row">Payment Method : <strong>${paymentMethod}</strong></div>
              </div>
            </div>
          </div>

          <table class="table-container">
            <thead>
              <tr>
                <th style="width: 6%; text-align: center;">#</th>
                <th style="width: 18%;">Transaction No</th>
                <th style="width: 26%;">Customer Name</th>
                <th style="width: 28%;">Ref No / Bank Details</th>
                <th style="width: 7%; text-align: center;">Currency</th>
                <th style="width: 15%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="summary-wrapper">
            <div class="summary-right">
              <table class="summary-table">
                <tr class="total-row">
                  <td>Grand Total:</td>
                  <td style="text-align: right; font-weight: 600;">${grandTotal}</td>
                </tr>
              </table>
            </div>
          </div> 
        </div>
     
        <div class="footer-section">
          <div class="footer-table">
            <div class="meta-info">
              <div>Issued By: <strong style="color: #0f172a; text-transform: uppercase;">${userId}</strong></div>
              <div>Printed Date: <strong>${printedDate} ${printedTime}</strong></div>
            </div>

            <div class="signature-box">
              <div class="signature-line"></div>
              <div style="font-size: 10px; font-weight: 700; color: #0f172a;">Authorised Officer</div>
              <div style="font-size: 9px; color: #64748b; text-align: left; margin-top: 4px;">NAME :</div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 9px; color: #94a3b8;">
            Page 1 of 1
          </div>
        </div> 
      </div>
    </body>
    </html>
  `;
};
