export const formattingTemplateValues = (value) => {
  let formattedValue = value.replaceAll('{{', '\'{{').replaceAll('}}', '}}\'');
  formattedValue = formattedValue.replaceAll('\'\'{{', '\'{{').replaceAll('}}\'\'', '}}\'');
  return formattedValue;
};
