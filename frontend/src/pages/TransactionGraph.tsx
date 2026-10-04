import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Network, Search, Wallet as WalletIcon,
  X, FileText
} from 'lucide-react';
import { walletService } from '../services/api';
import { CustomBlockchainNode } from '../components/CustomNode';
import { BrandShield } from '../components/BrandShield';

const nodeTypes = {
  customBlockchainNode: CustomBlockchainNode,
};

export const TransactionGraph: React.FC = () => {
  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const targetWallet = address || '0x742d35cc6634c0532925a3b844bc454e4438f44e';

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);

  // Fetch graph data from backend
  const { data: graphData, isLoading } = useQuery({
    queryKey: ['transactionGraph', targetWallet],
    queryFn: () => walletService.getGraph(targetWallet, 4, 'ethereum'),
  });

  useEffect(() => {
    if (graphData) {
      const formattedNodes: Node[] = graphData.nodes.map((n: any) => ({
        id: n.id,
        type: 'customBlockchainNode',
        position: n.position,
        data: n.data,
      }));

      const formattedEdges: Edge[] = graphData.edges.map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: e.animated,
        data: e.data,
        style: { stroke: '#0052FF', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: '#0052FF',
        },
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    }
  }, [graphData, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.data);
    setSelectedNode(null);
  }, []);

  const displayNodes = useMemo(() => {
    return nodes.filter((node: any) => {
      const matchSearch = searchTerm
        ? (node.data.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           node.data.address?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

      if (!matchSearch) return false;

      if (filterType === 'ALL') return true;
      if (filterType === 'VASPS') return node.data.entity_type === 'vasp';
      if (filterType === 'MIXERS') return node.data.entity_type === 'mixer';
      if (filterType === 'BRIDGES') return node.data.entity_type === 'bridge';
      if (filterType === 'HIGH_RISK') return node.data.risk_score >= 70;
      return true;
    });
  }, [nodes, filterType, searchTerm]);

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col relative rounded-3xl overflow-hidden border border-[#1f1f1f] bg-[#000000] shadow-2xl">
      {/* Top Graph Controls Bar */}
      <div className="h-16 border-b border-[#1c1c1c] bg-[#080808]/90 backdrop-blur-md px-5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-xs text-white">
            <BrandShield className="w-4 h-4 text-[#0052FF]" />
            <span>Multi-Hop Fund Traversal Canvas</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono bg-[#121212] px-3 py-1 rounded-full border border-[#222222] text-neutral-300">
            <span className="text-neutral-500 uppercase">Target:</span>
            <span className="text-rose-400 font-bold">{targetWallet.slice(0, 6)}...{targetWallet.slice(-4)}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['ALL', 'VASPS', 'MIXERS', 'BRIDGES', 'HIGH_RISK'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 rounded-full text-[10px] font-semibold font-mono uppercase transition-all ${
                filterType === f
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#222222]'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Node */}
        <div className="relative w-56">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search node or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-[#262626] rounded-full pl-9 pr-3.5 py-1.5 text-[11px] text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] font-mono"
          />
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative w-full h-full bg-[#000000]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#000000]/80 z-30">
            <div className="text-center space-y-2">
              <Network className="w-8 h-8 text-[#0052FF] animate-spin mx-auto" />
              <p className="text-xs text-neutral-400 font-mono">Building multi-hop transaction graph...</p>
            </div>
          </div>
        ) : null}

        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#000000]"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#222222" />
          <Controls className="!bg-[#0c0c0c] !border !border-[#222222] !rounded-2xl !shadow-xl [&>button]:!border-[#1f1f1f] [&>button]:!text-neutral-300 [&>button:hover]:!bg-[#1f1f1f]" />
        </ReactFlow>

        {/* Legend Overlay */}
        <div className="absolute bottom-5 left-5 p-4 rounded-2xl bg-[#0a0a0a]/95 border border-[#1f1f1f] backdrop-blur-md z-10 text-[10px] space-y-2 shadow-2xl">
          <p className="font-semibold text-white uppercase tracking-wider font-mono mb-1.5">Entity Legend</p>
          <div className="flex items-center gap-2 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Suspect Target Wallet</span>
          </div>
          <div className="flex items-center gap-2 text-[#0052FF]">
            <span className="w-2 h-2 rounded-full bg-[#0052FF]"></span>
            <span>VASP Deposit / Hot Wallet</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Privacy Mixer Contract</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Cross-Chain Bridge Gateway</span>
          </div>
        </div>

        {/* Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-5 right-5 w-88 bg-[#0c0c0c]/98 border border-[#222222] rounded-3xl shadow-2xl p-5 z-20 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <WalletIcon className="w-3.5 h-3.5 text-[#0052FF]" />
                Node Properties
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-[#1a1a1a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase">Entity Label</span>
                <p className="font-semibold text-white text-sm mt-0.5">{selectedNode.label}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase">Address</span>
                <p className="font-mono text-neutral-300 text-[11px] break-all select-all bg-[#141414] p-2.5 rounded-xl border border-[#222222] mt-1">
                  {selectedNode.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="bg-[#121212] p-2.5 rounded-xl border border-[#1f1f1f]">
                  <span className="text-[10px] text-neutral-400 uppercase">Category</span>
                  <p className="text-[#0052FF] font-semibold uppercase mt-0.5">{selectedNode.entity_type}</p>
                </div>
                <div className="bg-[#121212] p-2.5 rounded-xl border border-[#1f1f1f]">
                  <span className="text-[10px] text-neutral-400 uppercase">Risk Score</span>
                  <p className={`font-bold mt-0.5 ${selectedNode.risk_score >= 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedNode.risk_score ? `${selectedNode.risk_score.toFixed(1)}/100` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c1c1c] flex gap-2">
                <button
                  onClick={() => navigate(`/investigate/${selectedNode.address}`)}
                  className="flex-1 py-2 px-3 rounded-full bg-white hover:bg-neutral-200 text-black text-[11px] font-bold text-center transition-all"
                >
                  Analyze Wallet
                </button>
                <button
                  onClick={() => navigate(`/attribution/${selectedNode.address}`)}
                  className="py-2 px-3 rounded-full bg-[#171717] hover:bg-[#222222] border border-[#262626] text-white text-[11px] font-semibold text-center transition-all"
                >
                  Attribution
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edge Details Drawer */}
        {selectedEdge && (
          <div className="absolute top-5 right-5 w-88 bg-[#0c0c0c]/98 border border-[#222222] rounded-3xl shadow-2xl p-5 z-20 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#0052FF]" />
                Transaction Evidence
              </span>
              <button
                onClick={() => setSelectedEdge(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-[#1a1a1a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase">Transaction Hash</span>
                <p className="font-mono text-[#0052FF] text-[11px] break-all select-all bg-[#141414] p-2.5 rounded-xl border border-[#222222] mt-1">
                  {selectedEdge.transaction_hash}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="bg-[#121212] p-2.5 rounded-xl border border-[#1f1f1f]">
                  <span className="text-[10px] text-neutral-400 uppercase">Transferred Value</span>
                  <p className="text-emerald-400 font-bold text-sm mt-0.5">
                    {selectedEdge.amount} {selectedEdge.token}
                  </p>
                </div>
                <div className="bg-[#121212] p-2.5 rounded-xl border border-[#1f1f1f]">
                  <span className="text-[10px] text-neutral-400 uppercase">Transfer Type</span>
                  <p className="text-white font-semibold uppercase mt-0.5">{selectedEdge.transaction_type}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase">Timestamp</span>
                <p className="text-neutral-300 font-mono text-[11px] mt-0.5">{selectedEdge.timestamp || 'N/A'}</p>
              </div>

              <div className="pt-3 border-t border-[#1c1c1c]">
                <button
                  onClick={() => navigate('/sahyog')}
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold text-center shadow-lg transition-all"
                >
                  Draft SAHYOG Disclosure Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
