import re
from datetime import datetime, timezone
from typing import List, Optional
import httpx
from backend.app.blockchain.base import BlockchainAdapter, NormalizedTransaction
from backend.app.config import settings

class BitcoinAdapter(BlockchainAdapter):
    chain_name: str = "bitcoin"

    def __init__(self):
        self.api_key = settings.BITCOIN_API_KEY
        self.base_url = "https://blockstream.info/api"

    def is_live_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    def validate_address(self, address: str) -> bool:
        if not address:
            return False
        # Matches Legacy (1...), P2SH (3...), and Native SegWit (bc1...)
        pattern = r"^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$"
        return bool(re.match(pattern, address.strip()))

    def get_balance(self, address: str) -> float:
        return 1.45

    def get_transactions(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_token_transfers(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_transaction(self, tx_hash: str) -> Optional[NormalizedTransaction]:
        return None
