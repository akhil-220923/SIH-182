from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class NormalizedTransaction(BaseModel):
    transaction_hash: str
    chain: str # ethereum, bitcoin, bnb, polygon, tron, solana
    from_address: str
    to_address: str
    amount: float
    token: str = "NATIVE"
    token_symbol: str = "ETH"
    timestamp: datetime
    block_number: Optional[int] = None
    transaction_type: str = "TRANSFER" # TRANSFER, TOKEN_TRANSFER, SWAP, BRIDGE, DEPOSIT, WITHDRAWAL
    gas: Optional[float] = None
    status: str = "SUCCESS"
    source: str = "DEMO" # LIVE, DEMO, CACHED
    contract_address: Optional[str] = None
    token_decimals: int = 18

class BlockchainAdapter(ABC):
    chain_name: str = "base"

    @abstractmethod
    def validate_address(self, address: str) -> bool:
        """Validate if the string is a syntactically valid address for this blockchain."""
        pass

    @abstractmethod
    def get_transactions(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        """Fetch and normalize native transactions for an address."""
        pass

    @abstractmethod
    def get_balance(self, address: str) -> float:
        """Fetch current native balance."""
        pass

    @abstractmethod
    def get_token_transfers(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        """Fetch token transfers (ERC20/TRC20/BEP20/SPL) for an address."""
        pass

    @abstractmethod
    def get_transaction(self, tx_hash: str) -> Optional[NormalizedTransaction]:
        """Fetch and normalize a single transaction by hash."""
        pass

    @abstractmethod
    def is_live_available(self) -> bool:
        """Check if production/live API credentials are configured."""
        pass
