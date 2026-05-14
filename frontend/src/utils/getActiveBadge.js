import { Badge } from 'antd';

export const getActiveBadge = (
  isActive,
  options = {
    activeText: 'Active',
    inactiveText: 'Inactive',
  }
) => {
  const active = +isActive === 1;
  if (active) {
    return (
      <Badge
        count={options.activeText || 'Active'}
        style={{
          backgroundColor: '#def8dc',
          color: '#429040',
          fontSize: '12px',
          fontWeight: '500',
          padding: '0 12px',
          textTransform: 'uppercase',
        }}
      />
    );
  }
  return (
    <Badge
      count={options.inactiveText || 'Inactive'}
      style={{
        backgroundColor: '#ffd1d3',
        color: '#af1b2f',
        fontSize: '12px',
        fontWeight: '500',
        padding: '0 12px',
        textTransform: 'uppercase',
      }}
    />
  );
};
