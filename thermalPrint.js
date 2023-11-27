const puppeteer = require('puppeteer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { log } = require('console');

let browser;
let page;

const initialization = async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
};
initialization()

async function getPuppeteerPage() {
  console.log(browser);
  console.log(page);

  if (!browser) {

    browser = await puppeteer.launch({ headless: 'new' });
  }
  if (!page) {
    page = await browser.newPage();
  }
  return page;
}

const generateThermalHtml = ({ title, item, id, total_price, date }) => {
  console.log(title, item, id, total_price, date);
  `
  < !DOCTYPE html >
    <html dir="rtl">
      <head>
        <style>
          *,
          *::before,
          *::after {
            margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
      }

          body {
            background - color: #404040;
      }

          p {
            font - size: 16px;
      }

          .invoice {
            padding: 1rem;
          background-color: #fff;
      }

          .top {
            text - align: start;
      }
          .top h2 {
            margin - top: 50px;
      }

          .logo {
            display: flex;
          justify-content: end;
          margin-top: -90px;
      }

          .id {
            display: grid;
          grid-template-columns: 1fr 0.1fr;
          margin-top: 10px;
      }
          .table {
            border: 0.1rem dashed #000;
          padding: 0.2rem 0.5rem;
          margin: 1rem 0;
      }

          .table .headings {
            display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          border-bottom: 0.1rem dashed #000;
          padding-bottom: 0.2rem;
      }

          .table .body .element {
            display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      }

          .summary h4 {
            display: flex;
          justify-content: space-between;
          font-weight: normal;
      }

          .summary h4:last-child {
            font - weight: bold;
      }

          .rights {
            display: grid;
          grid-template-columns: auto;
          grid-template-rows: 2fr;
          margin-top: 20px;
      }
        </style>
      </head>

      <body>
        <div class="invoice">
          <div class="top">
            <h2>${title}</h2>
          </div>

          <div class="logo">
            <img src="photo_2023-11-15_21-30-35.png" height="200px" alt="" />
          </div>

          <div class="id">
            <h4 style="text-align: end">${id}</h4>
            <h4 style="text-align: end">: No</h4>
            <p style="text-align: start; margin-top: 10px">بەروار : ${date}</p>
          </div>
          <div class="table">
            <div class="headings">
              <h4>بەرهەم</h4>
              <h4>ژ.ک</h4>
              <h4>ژ.د</h4>
              <h4>نرخ.ک</h4>
              <h4>نرخ.د</h4>
            </div>
            <div class="body">
              ${(item.map(item => (`
          <div class="element">
            <p>${item.name}</p>
            <p>${item.carton_qty}</p>
            <p>${item.item_qty}</p>
            <p>${(Number(item.carton_price) * 1000).toLocaleString()}</p>
            <p>${(Number(item.item_price) * 1000).toLocaleString()}</p>
          </div>
          ` ))).join('')}
            </div>
          </div>

          <div class="summary">
            <h4>
              <span>کۆی گشتی</span
              ><span>${(total_price * 1000).toLocaleString()} د.ع</span>
            </h4>
          </div>

          <div class="rights">
            <p>ناونیشان :</p>
            <p>سلێمانی - چوارباخ - تەنیشت مزگەوتی چوارباخ</p>
            <p style="margin-top: 5px">ژ.م : 6072 136 0770</p>
          </div>
        </div>
      </body>
    </html>
`
};

async function thermalPrint(printerName, data) {
  try {
    console.log(data.item.map(obj => obj.name));
    const page = await getPuppeteerPage();
    const htmlContent = generateThermalHtml({
      title: 'هەرزان بازاری سامبا', ...data
    });
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    const pdfPath = path.join(__dirname, uuidv4().replace(/-/g, '') + '.pdf');
    const bodyHandle = await page.$('body');
    await bodyHandle.dispose();
    await page.pdf({ path: pdfPath, width: '80mm' });
console.log(page);

  } catch (error) {
    console.log(error);
    throw new Error('Failed to print thermal invoice');
  }
}

module.exports = thermalPrint;