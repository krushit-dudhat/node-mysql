const db = require('../connection/db.conn');
const xl = require('exceljs');

const writeExcel = async (data, sheet) => {
  sheet.addRow([
    "Name",
    "Description",
    "Price",
    "Provider",
    "Image",
  ]);

  const rows = data.map((item) => {
    sheet.addRow([
      item.name,
      item.description,
      item.price,
      item.provider,
      item.image,
    ]);
  });
  return sheet;
}

process.on("message", async (message) => {
  const { query } = message;

  const data = await db.queryExec(query);
  const workbook = new xl.Workbook();
  const sheet = workbook.addWorksheet('product sheet');
  writeExcel(data.results, sheet);
  const buffer = await workbook.xlsx.writeBuffer();
  // console.log(Buffer.isBuffer(buffer));
  const serializedBuffer = buffer.toString('base64');

  process.send(serializedBuffer);
})

process.on('uncaughtException', error => {
  console.error(`Uncaught exception: ${error}`);
});

process.on('unhandledRejection', error => {
  console.error(`Unhandled promise rejection: ${error}`);
});

module.exports = {
  writeExcel,
};
