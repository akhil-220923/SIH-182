from typing import List, Dict, Any, Optional, Set
import networkx as nx
from sqlalchemy.orm import Session
from backend.app.models.transaction import Transaction
from backend.app.models.wallet import Wallet
from backend.app.models.vasp import VASPAddress, VASP

class TransactionGraphEngine:
    def __init__(self, db: Session):
        self.db = db

    def build_graph(
        self,
        target_wallet: str,
        max_hops: int = 3,
        blockchain: str = "ethereum"
    ) -> Dict[str, Any]:
        """
        Builds a directed multi-hop transaction graph starting from target_wallet.
        Returns a dictionary suitable for React Flow: { "nodes": [...], "edges": [...], "metrics": {...} }
        """
        target = target_wallet.strip().lower()
        graph = nx.DiGraph()

        # Step 1: Pre-fetch known VASP addresses and wallets
        vasp_addrs = self.db.query(VASPAddress).all()
        vasp_lookup = {va.address.lower(): va for va in vasp_addrs}

        db_wallets = self.db.query(Wallet).all()
        wallet_lookup = {w.address.lower(): w for w in db_wallets}

        # Step 2: Multi-hop traversal using BFS queue
        visited_nodes: Set[str] = {target}
        current_layer: Set[str] = {target}
        collected_txs: List[Transaction] = []

        for hop in range(1, max_hops + 1):
            if not current_layer:
                break
            
            # Fetch transactions where from_address is in current_layer
            txs = self.db.query(Transaction).filter(
                Transaction.from_address.in_(list(current_layer))
            ).all()

            next_layer: Set[str] = set()
            for tx in txs:
                collected_txs.append(tx)
                to_addr = tx.to_address.lower()
                if to_addr not in visited_nodes:
                    visited_nodes.add(to_addr)
                    # Don't expand further if node is a recognized main VASP hot wallet to avoid graph explosion
                    is_terminal_vasp = False
                    if to_addr in vasp_lookup and vasp_lookup[to_addr].address_type.value == "HOT_WALLET":
                        is_terminal_vasp = True
                    if not is_terminal_vasp:
                        next_layer.add(to_addr)

            current_layer = next_layer

        # Step 3: Populate NetworkX graph
        for tx in collected_txs:
            u = tx.from_address.lower()
            v = tx.to_address.lower()

            # Helper to classify entity type and label
            for addr in (u, v):
                if addr not in graph.nodes:
                    entity_type = "unknown_entity"
                    label = f"{addr[:6]}...{addr[-4:]}"
                    risk_score = 30.0
                    risk_level = "LOW"

                    if addr == target:
                        entity_type = "wallet"
                        label = f"Suspect Wallet ({addr[:6]}...)"
                        risk_score = 94.5
                        risk_level = "CRITICAL"
                    elif addr in vasp_lookup:
                        va = vasp_lookup[addr]
                        entity_type = "vasp"
                        label = f"{va.vasp_id} ({va.address_type.value})"
                        risk_score = 15.0
                        risk_level = "LOW"
                    elif addr in wallet_lookup:
                        w = wallet_lookup[addr]
                        entity_type = w.entity_type
                        label = w.label or label
                        risk_score = w.risk_score
                        risk_level = w.risk_level

                    graph.add_node(
                        addr,
                        id=addr,
                        address=addr,
                        label=label,
                        entity_type=entity_type,
                        risk_score=risk_score,
                        risk_level=risk_level,
                        is_target=(addr == target)
                    )

            edge_id = f"e-{tx.transaction_hash[:10]}-{u[:4]}-{v[:4]}"
            graph.add_edge(
                u,
                v,
                id=edge_id,
                transaction_hash=tx.transaction_hash,
                amount=tx.amount,
                token=tx.token_symbol,
                timestamp=tx.timestamp.isoformat() if tx.timestamp else None,
                transaction_type=tx.transaction_type,
                chain=tx.chain
            )

        # Step 4: Ensure target node is present even if isolated
        if target not in graph.nodes:
            graph.add_node(
                target,
                id=target,
                address=target,
                label=f"Suspect Wallet ({target[:6]}...)",
                entity_type="wallet",
                risk_score=50.0,
                risk_level="MEDIUM",
                is_target=True
            )

        # Step 5: Format for React Flow
        react_flow_nodes = []
        # Calculate a tree/layered layout positions based on shortest path distance from target
        distances = {}
        for node in graph.nodes:
            try:
                d = nx.shortest_path_length(graph, source=target, target=node)
                distances[node] = d
            except Exception:
                distances[node] = 0

        # Group by layer for visual positioning
        layers: Dict[int, List[str]] = {}
        for node, dist in distances.items():
            layers.setdefault(dist, []).append(node)

        for dist, node_list in layers.items():
            y_spacing = 130
            x_spacing = 300
            start_y = -((len(node_list) - 1) * y_spacing) / 2

            for i, node_id in enumerate(node_list):
                data = graph.nodes[node_id]
                react_flow_nodes.append({
                    "id": node_id,
                    "type": "customBlockchainNode",
                    "position": {
                        "x": 100 + dist * x_spacing,
                        "y": 250 + start_y + i * y_spacing
                    },
                    "data": data
                })

        react_flow_edges = []
        for u, v, data in graph.edges(data=True):
            react_flow_edges.append({
                "id": data["id"],
                "source": u,
                "target": v,
                "label": f"{data['amount']:.2f} {data['token']}",
                "animated": data.get("transaction_type") in ["TRANSFER", "BRIDGE", "DEPOSIT"],
                "data": data
            })

        # Calculate graph metrics
        metrics = {
            "total_nodes": graph.number_of_nodes(),
            "total_edges": graph.number_of_edges(),
            "max_depth_reached": max(distances.values()) if distances else 0,
            "density": nx.density(graph),
            "is_directed_acyclic": nx.is_directed_acyclic_graph(graph)
        }

        return {
            "nodes": react_flow_nodes,
            "edges": react_flow_edges,
            "metrics": metrics
        }
