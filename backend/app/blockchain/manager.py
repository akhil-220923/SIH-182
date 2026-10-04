from typing import Dict, Optional, Type
from backend.app.blockchain.base import BlockchainAdapter
from backend.app.blockchain.ethereum import EthereumAdapter
from backend.app.blockchain.bitcoin import BitcoinAdapter
from backend.app.blockchain.bnb import BNBAdapter
from backend.app.blockchain.polygon import PolygonAdapter
from backend.app.blockchain.tron import TronAdapter
from backend.app.blockchain.solana import SolanaAdapter

ADAPTERS: Dict[str, Type[BlockchainAdapter]] = {
    "ethereum": EthereumAdapter,
    "bitcoin": BitcoinAdapter,
    "bnb": BNBAdapter,
    "polygon": PolygonAdapter,
    "tron": TronAdapter,
    "solana": SolanaAdapter,
}

def get_blockchain_adapter(chain: str) -> BlockchainAdapter:
    normalized_chain = chain.lower().strip()
    adapter_cls = ADAPTERS.get(normalized_chain)
    if not adapter_cls:
        raise ValueError(f"Unsupported blockchain '{chain}'. Supported chains: {list(ADAPTERS.keys())}")
    return adapter_cls()

def detect_blockchain(address: str) -> Optional[str]:
    clean_addr = address.strip()
    if clean_addr.startswith("0x") and len(clean_addr) == 42:
        return "ethereum"
    if clean_addr.startswith("bc1") or clean_addr.startswith("1") or clean_addr.startswith("3"):
        return "bitcoin"
    if clean_addr.startswith("T") and len(clean_addr) == 34:
        return "tron"
    if len(clean_addr) >= 32 and len(clean_addr) <= 44 and not clean_addr.startswith("0x"):
        return "solana"
    return "ethereum"
