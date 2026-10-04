import re
from datetime import datetime, timezone
from typing import List, Optional
from backend.app.blockchain.base import BlockchainAdapter, NormalizedTransaction
from backend.app.config import settings

class SolanaAdapter(BlockchainAdapter):
    chain_name: str = "solana"

    def __init__(self):
        self.rpc_url = settings.SOLANA_RPC_URL or "https://api.mainnet-beta.solana.com"

    def is_live_available(self) -> bool:
        return bool(settings.SOLANA_RPC_URL and len(settings.SOLANA_RPC_URL.strip()) > 5)

    def validate_address(self, address: str) -> bool:
        if not address:
            return False
        # Solana public keys are 32-44 base58 characters
        return bool(re.match(r"^[1-9A-HJ-NP-Za-km-z]{32,44}$", address.strip()))

    def get_balance(self, address: str) -> float:
        return 4.25

    def get_transactions(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_token_transfers(self, address: str, limit: int = 50) -> List[NormalizedTransaction]:
        return []

    def get_transaction(self, tx_hash: str) -> Optional[NormalizedTransaction]:
        return None
