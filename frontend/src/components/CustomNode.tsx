import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ShieldAlert, Building2, Shuffle, ArrowLeftRight, Wallet as WalletIcon } from 'lucide-react';

interface CustomNodeProps {
  data: {
    id: string;
    address: string;
    label: string;
    entity_type: string;
    risk_score: number;
    risk_level: string;
    is_target?: boolean;
  };
  selected?: boolean;
}

export const CustomBlockchainNode = memo(({ data, selected }: CustomNodeProps) => {
  const isTarget = data.is_target;
  const entityType = data.entity_type;

  let borderColor = 'border-[#222222]';
  let bgColor = 'bg-[#0e0e0e]';
  let badgeColor = 'bg-[#141414] text-neutral-300 border border-[#262626]';
  let icon = <WalletIcon className="w-3.5 h-3.5 text-neutral-400" />;

  if (isTarget) {
    borderColor = 'border-rose-600 shadow-xl shadow-rose-950/40';
    bgColor = 'bg-[#140a0c]';
    badgeColor = 'bg-rose-950/80 text-rose-300 border border-rose-800';
    icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
  } else if (entityType === 'vasp') {
    borderColor = 'border-[#0052FF] shadow-xl shadow-blue-950/40';
    bgColor = 'bg-[#0a0f1d]';
    badgeColor = 'bg-blue-950/80 text-blue-300 border border-blue-800';
    icon = <Building2 className="w-3.5 h-3.5 text-[#0052FF]" />;
  } else if (entityType === 'mixer') {
    borderColor = 'border-purple-600 shadow-xl shadow-purple-950/40';
    bgColor = 'bg-[#120a1a]';
    badgeColor = 'bg-purple-950/80 text-purple-300 border border-purple-800';
    icon = <Shuffle className="w-3.5 h-3.5 text-purple-400" />;
  } else if (entityType === 'bridge') {
    borderColor = 'border-amber-600 shadow-xl shadow-amber-950/40';
    bgColor = 'bg-[#171208]';
    badgeColor = 'bg-amber-950/80 text-amber-300 border border-amber-800';
    icon = <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />;
  }

  const truncatedAddr = data.address
    ? `${data.address.slice(0, 6)}...${data.address.slice(-4)}`
    : data.id;

  return (
    <div
      className={`px-3.5 py-3 rounded-2xl border backdrop-blur-md transition-all min-w-[210px] ${borderColor} ${bgColor} ${
        selected ? 'ring-2 ring-[#0052FF] scale-105 shadow-2xl' : ''
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#0052FF] !w-2.5 !h-2.5 !border-0" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[11px] font-bold text-white truncate max-w-[130px]">
            {data.label}
          </span>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${badgeColor}`}>
          {isTarget ? 'TARGET' : entityType}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 bg-[#080808] px-2.5 py-1.5 rounded-xl border border-[#1c1c1c]">
        <span>{truncatedAddr}</span>
        <span
          className={`font-bold ${
            data.risk_score >= 80
              ? 'text-rose-400'
              : data.risk_score >= 50
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        >
          {data.risk_score ? `${data.risk_score.toFixed(0)} Risk` : 'Low Risk'}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-[#0052FF] !w-2.5 !h-2.5 !border-0" />
    </div>
  );
});

CustomBlockchainNode.displayName = 'CustomBlockchainNode';
