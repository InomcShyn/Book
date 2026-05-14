import dayjs from 'dayjs';

export const formatNumber = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) return '0';

  const { decimals = 0, prefix = '', suffix = '', locale = 'en-US' } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value));
};

export const formatNumber_2 = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) return '0';

  const {
    decimals,        
    prefix = '',
    suffix = '',
    locale = 'en-US',
  } = options;

  const number = Number(value);

  const formatterOptions =
    decimals === undefined
      ? {
          maximumFractionDigits: 20, 
        }
      : {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        };

  return (
    prefix +
    new Intl.NumberFormat(locale, formatterOptions).format(number) +
    suffix
  );
};


export const formatNumberMaxLength = (value, options = {}) => {
  if (value === null || value === undefined) return '0';

  const { decimals = 0, prefix = '', suffix = '' } = options;
  const strValue = value.toString();
  if (!/^\d+(\.\d+)?$/.test(strValue)) return '0';
  const [intPart, decPart] = strValue.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = decPart
    ? `${formattedInt}.${decPart.slice(0, decimals || decPart.length)}`
    : formattedInt;

  return `${prefix}${formatted}${suffix}`;
};


export function formatPeriod(startDate, endDate) {
  return `${dayjs(startDate).format('YYYY/MM/DD')} - ${dayjs(endDate).format('YYYY/MM/DD')}`;
}

export function formatDate(date, format = 'YYYY/MM/DD HH:mm:ss') {
  return dayjs(date).format(format);
}

export function columnSorter(dataIndex, type = 'string') {
  switch (type) {
    case 'number':
      return (a, b) => a[dataIndex] - b[dataIndex];
    case 'date':
      return (a, b) => new Date(a[dataIndex]) - new Date(b[dataIndex]);
    case 'string':
    default:
      return (a, b) =>
        a[dataIndex]?.toString()?.localeCompare(b[dataIndex].toString(), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
  }
}
