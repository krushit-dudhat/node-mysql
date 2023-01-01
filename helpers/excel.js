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

module.exports = {
  writeExcel,
};
