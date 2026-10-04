import re
from datetime import datetime, timezone
from typing import List, Optional
from backend.app.blockchain.base import BlockchainAdapter, NormalizedTransaction
from backend.app.config import settings

class BNBAdapter(BlockchainAdapter):
    chain_name: str = "bnb"

    def __init__(self):
        self.api_key = settings.BNB_API_KEY
        self.base_url = "https://api.bscscan.com/api"

    def is_live_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    def validate_address(self, address: str) -> bool:
        if not address:
            return False
        return bool(re.match(r"^0x[a-fA-F0-9]{40}$", address.strip()))

    def get_balance(self, address: str) -> float:
        return 12.5

    def get_transactions(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_token_transfers(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_transaction(self, tx_hash: str) -> Optional[NormalizedTransaction]:
        return None
