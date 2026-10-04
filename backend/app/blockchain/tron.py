import re
from datetime import datetime, timezone
from typing import List, Optional
from backend.app.blockchain.base import BlockchainAdapter, NormalizedTransaction
from backend.app.config import settings

class TronAdapter(BlockchainAdapter):
    chain_name: str = "tron"

    def __init__(self):
        self.api_key = settings.TRON_API_KEY
        self.base_url = "https://api.trongrid.io"

    def is_live_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    def validate_address(self, address: str) -> bool:
        if not address:
            return False
        # Tron addresses start with T and are 34 base58 characters
        return bool(re.match(r"^T[a-km-zA-HJ-NP-Z1-9]{33}$", address.strip()))

    def get_balance(self, address: str) -> float:
        return 1500.0

    def get_transactions(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_token_transfers(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_transaction(self, tx_hash: str) -> Optional[NormalizedTransaction]:
        return None
