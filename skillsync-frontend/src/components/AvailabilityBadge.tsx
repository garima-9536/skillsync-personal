import React from 'react';
import { AvailabilityStatus } from '../model/User';

const config: Record<AvailabilityStatus, { cls: string; dot: string; label: string; pulse: boolean }> = {
  OPEN:      { cls: 'badge-open', dot: 'bg-emerald-500', label: 'Open to Collaborate', pulse: true },
  PART_TIME: { cls: 'badge-part', dot: 'bg-amber-500',   label: 'Part-time Available',  pulse: false },
  BUSY:      { cls: 'badge-busy', dot: 'bg-red-500',     label: 'Busy',                 pulse: false },
};

const AvailabilityBadge = ({ status }: { status: AvailabilityStatus }) => {
  const { cls, dot, label, pulse } = config[status] || config.BUSY;
  return (
    <span className={cls}>
      <span className={`dot ${dot} ${pulse ? 'dot-pulse' : ''}`} />
      {label}
    </span>
  );
};

export default AvailabilityBadge;
