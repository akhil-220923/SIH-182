import os
import sys

# Ensure root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, Base, engine
from backend.app.models.user import User, UserRole
from backend.app.models.case import Case, CaseStatus, CasePriority
from backend.app.models.wallet import Wallet
from backend.app.models.transaction import Transaction
from backend.app.models.vasp import VASP, VASPAddress, AddressType, VerificationStatus
from backend.app.models.attribution import Attribution
from backend.app.models.risk import RiskAssessment
from backend.app.models.typology import TypologyDetection
from backend.app.models.evidence import Evidence
from backend.app.models.audit import AuditLog
from backend.app.auth.security import hash_password

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Users if not present
        if not db.query(User).filter(User.email == "investigator@tracevasp.demo").first():
            demo_users = [
                User(
                    email="investigator@tracevasp.demo",
                    username="investigator_rajesh",
                    full_name="Insp. Rajesh Kumar",
                    hashed_password=hash_password("Demo@12345"),
                    badge_number="LEA-KA-5419",
                    agency="Cyber Crime Investigation Cell (CCIC)",
                    role=UserRole.INVESTIGATOR,
                    is_active=True
                ),
                User(
                    email="supervisor@tracevasp.demo",
                    username="supervisor_sen",
                    full_name="SP Vikram Sen",
                    hashed_password=hash_password("Supervisor@12345"),
                    badge_number="LEA-DIR-102",
                    agency="State Cyber Operations Directorate",
                    role=UserRole.SUPERVISOR,
                    is_active=True
                ),
                User(
                    email="admin@tracevasp.demo",
                    username="admin_tracevasp",
                    full_name="Platform Administrator",
                    hashed_password=hash_password("Admin@12345"),
                    badge_number="SEC-SYS-01",
                    agency="TraceVASP Platform Operations",
                    role=UserRole.ADMIN,
                    is_active=True
                )
            ]
            db.add_all(demo_users)
            db.commit()
            print("✓ Seeded demo users.")

        # 2. Seed Demo VASPs and Addresses
        if not db.query(VASP).filter(VASP.vasp_id == "VASP-ALPHA").first():
            vasps_data = [
                VASP(
                    vasp_id="VASP-ALPHA",
                    name="Demo Exchange Alpha",
                    legal_name="Alpha Global Asset Holdings Ltd.",
                    country="Seychelles / International",
                    website="https://alpha-exchange.demo",
                    compliance_email="compliance@alpha-exchange.demo",
                    risk_category="REGULATED_EXCHANGE",
                    verification_status=VerificationStatus.DEMO,
                    description="Major centralized digital asset exchange with verified deposit clustering patterns and FIU registration."
                ),
                VASP(
                    vasp_id="VASP-BETA",
                    name="Demo Exchange Beta",
                    legal_name="Beta Fintech Operations Pte.",
                    country="Singapore",
                    website="https://beta-exchange.demo",
                    compliance_email="law-enforcement@beta-exchange.demo",
                    risk_category="REGULATED_EXCHANGE",
                    verification_status=VerificationStatus.DEMO,
                    description="Secondary regional crypto trading platform with automated API clearing."
                ),
                VASP(
                    vasp_id="VASP-GAMMA",
                    name="Demo Custodian Gamma",
                    legal_name="Gamma Digital Custody AG",
                    country="Switzerland",
                    website="https://gamma-custody.demo",
                    compliance_email="legal@gamma-custody.demo",
                    risk_category="CUSTODIAN",
                    verification_status=VerificationStatus.DEMO,
                    description="Licensed institutional cold storage and custodial asset manager."
                ),
                VASP(
                    vasp_id="VASP-DELTA",
                    name="Demo P2P Gateway Delta",
                    legal_name="Delta Peer Transfers Inc.",
                    country="Panama",
                    website="https://delta-p2p.demo",
                    compliance_email="abuse@delta-p2p.demo",
                    risk_category="HIGH_RISK_EXCHANGE",
                    verification_status=VerificationStatus.DEMO,
                    description="Unregistered peer-to-peer cryptocurrency matching service."
                )
            ]
            db.add_all(vasps_data)
            db.commit()

            addresses_data = [
                VASPAddress(
                    vasp_id="VASP-ALPHA",
                    blockchain="ethereum",
                    address="0x1111111254fb6c44bac0bed2854e76f90643097d",
                    address_type=AddressType.HOT_WALLET,
                    label_source="Demo Exchange Alpha Main Hot Wallet",
                    verification_status=VerificationStatus.DEMO
                ),
                VASPAddress(
                    vasp_id="VASP-ALPHA",
                    blockchain="ethereum",
                    address="0x28c6c06298d514db089934071355e5743bf21d60",
                    address_type=AddressType.DEPOSIT_WALLET,
                    label_source="Demo Exchange Alpha Ingestion Cluster",
                    verification_status=VerificationStatus.DEMO
                ),
                VASPAddress(
                    vasp_id="VASP-BETA",
                    blockchain="ethereum",
                    address="0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
                    address_type=AddressType.HOT_WALLET,
                    label_source="Demo Exchange Beta Hot Wallet 1",
                    verification_status=VerificationStatus.DEMO
                ),
                VASPAddress(
                    vasp_id="VASP-BETA",
                    blockchain="ethereum",
                    address="0xdfd5293d8e347dfe59e90efd55b295681375f22d",
                    address_type=AddressType.DEPOSIT_WALLET,
                    label_source="Demo Exchange Beta Deposit Pool",
                    verification_status=VerificationStatus.DEMO
                ),
                VASPAddress(
                    vasp_id="VASP-GAMMA",
                    blockchain="ethereum",
                    address="0x503828976d22510aad0201ac7ec88293211d23dc",
                    address_type=AddressType.CUSTODIAL_WALLET,
                    label_source="Demo Custodian Gamma Reserve Vault",
                    verification_status=VerificationStatus.DEMO
                )
            ]
            db.add_all(addresses_data)
            db.commit()
            print("✓ Seeded demo VASPs and addresses.")

        # 3. Seed Demo Case: CASE-DEMO-182
        suspect_wallet = "0x742d35cc6634c0532925a3b844bc454e4438f44e"
        if not db.query(Case).filter(Case.case_id == "CASE-DEMO-182").first():
            demo_case = Case(
                case_id="CASE-DEMO-182",
                title="Operation CryptoTrace — Suspected Layering to Offshore VASP",
                description="Investigation initiated into rapid diversion of stolen digital assets through 3-hop intermediary layering chain, culminating in a deposit to Demo Exchange Alpha deposit clustering.",
                priority=CasePriority.CRITICAL,
                status=CaseStatus.UNDER_ANALYSIS,
                suspect_wallets=[suspect_wallet],
                notes="Primary target address 0x742d35cc6634c0532925a3b844bc454e4438f44e received high-value illicit proceeds. Multi-hop fund tracing confirmed rapid movement toward VASP-ALPHA deposit gateway. Disclosure request to be filed via SAHYOG."
            )
            db.add(demo_case)
            db.commit()
            print("✓ Seeded demo case CASE-DEMO-182.")

        # 4. Seed Wallets
        wallets_to_seed = [
            Wallet(
                address=suspect_wallet,
                blockchain="ethereum",
                entity_type="wallet",
                label="Target Suspect Wallet",
                risk_score=94.5,
                risk_level="CRITICAL",
                first_seen=datetime(2026, 3, 15, 10, 15, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 20, 16, 45, 0, tzinfo=timezone.utc),
                total_received=85.0,
                total_sent=82.5,
                balance=2.5,
                tx_count=12,
                is_monitored=True
            ),
            Wallet(
                address="0x888888887b20e060ea8d11c039dbad6014490888",
                blockchain="ethereum",
                entity_type="wallet",
                label="Intermediary Wallet A (Hop 1)",
                risk_score=82.0,
                risk_level="HIGH",
                first_seen=datetime(2026, 3, 15, 10, 30, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 16, 12, 0, 0, tzinfo=timezone.utc),
                total_received=45.5,
                total_sent=45.5,
                balance=0.0,
                tx_count=6,
                is_monitored=True
            ),
            Wallet(
                address="0x999999993ea089cfb0df4bb5333d83dd2cf19999",
                blockchain="ethereum",
                entity_type="wallet",
                label="Intermediary Wallet B (Hop 2)",
                risk_score=78.5,
                risk_level="HIGH",
                first_seen=datetime(2026, 3, 15, 11, 0, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 16, 14, 0, 0, tzinfo=timezone.utc),
                total_received=32.0,
                total_sent=31.8,
                balance=0.2,
                tx_count=4,
                is_monitored=True
            ),
            Wallet(
                address="0x28c6c06298d514db089934071355e5743bf21d60",
                blockchain="ethereum",
                entity_type="vasp",
                label="Demo Exchange Alpha (Deposit Cluster)",
                risk_score=15.0,
                risk_level="LOW",
                first_seen=datetime(2026, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 20, 18, 0, 0, tzinfo=timezone.utc),
                total_received=1420.5,
                total_sent=1420.0,
                balance=0.5,
                tx_count=180,
                is_monitored=False
            ),
            Wallet(
                address="0x1111111254fb6c44bac0bed2854e76f90643097d",
                blockchain="ethereum",
                entity_type="vasp",
                label="Demo Exchange Alpha (Main Hot Wallet)",
                risk_score=10.0,
                risk_level="LOW",
                first_seen=datetime(2025, 6, 1, 0, 0, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 20, 18, 0, 0, tzinfo=timezone.utc),
                total_received=85000.0,
                total_sent=82000.0,
                balance=3000.0,
                tx_count=14500,
                is_monitored=False
            ),
            Wallet(
                address="0xaaaa111122223333444455556666777788889999",
                blockchain="ethereum",
                entity_type="wallet",
                label="Peel Intermediary X",
                risk_score=68.0,
                risk_level="MEDIUM",
                first_seen=datetime(2026, 3, 15, 12, 0, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 16, 15, 0, 0, tzinfo=timezone.utc),
                total_received=13.5,
                total_sent=13.0,
                balance=0.5,
                tx_count=5,
                is_monitored=False
            ),
            Wallet(
                address="0xdfd5293d8e347dfe59e90efd55b295681375f22d",
                blockchain="ethereum",
                entity_type="vasp",
                label="Demo Exchange Beta (Deposit Pool)",
                risk_score=20.0,
                risk_level="LOW",
                first_seen=datetime(2026, 2, 1, 0, 0, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 20, 17, 0, 0, tzinfo=timezone.utc),
                total_received=890.0,
                total_sent=885.0,
                balance=5.0,
                tx_count=95,
                is_monitored=False
            ),
            Wallet(
                address="0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
                blockchain="ethereum",
                entity_type="mixer",
                label="DemoMixer Cash Contract",
                risk_score=99.0,
                risk_level="CRITICAL",
                first_seen=datetime(2025, 8, 1, 0, 0, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 20, 18, 0, 0, tzinfo=timezone.utc),
                total_received=54000.0,
                total_sent=53900.0,
                balance=100.0,
                tx_count=12000,
                is_monitored=True
            ),
            Wallet(
                address="0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
                blockchain="ethereum",
                entity_type="bridge",
                label="DemoBridge Protocol Gateway",
                risk_score=55.0,
                risk_level="MEDIUM",
                first_seen=datetime(2025, 9, 1, 0, 0, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 20, 18, 0, 0, tzinfo=timezone.utc),
                total_received=120000.0,
                total_sent=119000.0,
                balance=1000.0,
                tx_count=45000,
                is_monitored=False
            ),
            Wallet(
                address="0xbbbb222233334444555566667777888899990000",
                blockchain="ethereum",
                entity_type="wallet",
                label="Fan-out Recipient 1",
                risk_score=45.0,
                risk_level="MEDIUM",
                first_seen=datetime(2026, 3, 15, 10, 20, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 15, 10, 25, 0, tzinfo=timezone.utc),
                total_received=5.0,
                total_sent=0.0,
                balance=5.0,
                tx_count=1,
                is_monitored=False
            ),
            Wallet(
                address="0xcccc333344445555666677778888999900001111",
                blockchain="ethereum",
                entity_type="wallet",
                label="Fan-out Recipient 2",
                risk_score=45.0,
                risk_level="MEDIUM",
                first_seen=datetime(2026, 3, 15, 10, 22, 0, tzinfo=timezone.utc),
                last_seen=datetime(2026, 3, 15, 10, 30, 0, tzinfo=timezone.utc),
                total_received=4.0,
                total_sent=0.0,
                balance=4.0,
                tx_count=1,
                is_monitored=False
            )
        ]

        for w in wallets_to_seed:
            existing = db.query(Wallet).filter(Wallet.address == w.address).first()
            if not existing:
                db.add(w)
        db.commit()
        print("✓ Seeded demo wallets.")

        # 5. Seed Realistic Multi-Hop Transactions (25+ transactions)
        base_time = datetime(2026, 3, 15, 10, 31, 0, tzinfo=timezone.utc)
        demo_txs = [
            # Inbound theft into suspect wallet
            Transaction(
                transaction_hash="0xaa01010101010101010101010101010101010101010101010101010101010101",
                chain="ethereum",
                from_address="0x3333333333333333333333333333333333333333",
                to_address=suspect_wallet,
                amount=85.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time - timedelta(minutes=45),
                block_number=19420000,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            ),
            # Hop 1: Suspect Wallet -> Intermediary A
            Transaction(
                transaction_hash="0xaa02020202020202020202020202020202020202020202020202020202020202",
                chain="ethereum",
                from_address=suspect_wallet,
                to_address="0x888888887b20e060ea8d11c039dbad6014490888",
                amount=45.5,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=13),
                block_number=19420065,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            ),
            # Fan-out split from Suspect Wallet
            Transaction(
                transaction_hash="0xaa03030303030303030303030303030303030303030303030303030303030303",
                chain="ethereum",
                from_address=suspect_wallet,
                to_address="0xbbbb222233334444555566667777888899990000",
                amount=5.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=18),
                block_number=19420090,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            ),
            Transaction(
                transaction_hash="0xaa04040404040404040404040404040404040404040404040404040404040404",
                chain="ethereum",
                from_address=suspect_wallet,
                to_address="0xcccc333344445555666677778888999900001111",
                amount=4.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=22),
                block_number=19420110,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            ),
            # Mixer interaction from Suspect Wallet
            Transaction(
                transaction_hash="0xaa05050505050505050505050505050505050505050505050505050505050505",
                chain="ethereum",
                from_address=suspect_wallet,
                to_address="0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
                amount=5.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=27),
                block_number=19420135,
                transaction_type="TRANSFER",
                gas=0.0085,
                status="SUCCESS",
                source="DEMO"
            ),
            # Bridge interaction from Suspect Wallet
            Transaction(
                transaction_hash="0xaa06060606060606060606060606060606060606060606060606060606060606",
                chain="ethereum",
                from_address=suspect_wallet,
                to_address="0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
                amount=10.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=32),
                block_number=19420160,
                transaction_type="BRIDGE",
                gas=0.0054,
                status="SUCCESS",
                source="DEMO"
            ),
            # Hop 2: Intermediary A -> Intermediary B
            Transaction(
                transaction_hash="0xaa07070707070707070707070707070707070707070707070707070707070707",
                chain="ethereum",
                from_address="0x888888887b20e060ea8d11c039dbad6014490888",
                to_address="0x999999993ea089cfb0df4bb5333d83dd2cf19999",
                amount=32.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=38),
                block_number=19420190,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            ),
            # Peel chain side-branch from Intermediary A -> Peel Intermediary X
            Transaction(
                transaction_hash="0xaa08080808080808080808080808080808080808080808080808080808080808",
                chain="ethereum",
                from_address="0x888888887b20e060ea8d11c039dbad6014490888",
                to_address="0xaaaa111122223333444455556666777788889999",
                amount=13.5,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=44),
                block_number=19420220,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            ),
            # Hop 3: Intermediary B -> Demo Exchange Alpha Deposit Cluster (VASP-ALPHA)
            Transaction(
                transaction_hash="0xaa09090909090909090909090909090909090909090909090909090909090909",
                chain="ethereum",
                from_address="0x999999993ea089cfb0df4bb5333d83dd2cf19999",
                to_address="0x28c6c06298d514db089934071355e5743bf21d60",
                amount=31.8,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=51),
                block_number=19420255,
                transaction_type="DEPOSIT",
                gas=0.0035,
                status="SUCCESS",
                source="DEMO"
            ),
            # Hop 4: Demo Exchange Alpha Deposit Cluster -> Main Hot Wallet (Internal VASP sweep)
            Transaction(
                transaction_hash="0xaa10101010101010101010101010101010101010101010101010101010101010",
                chain="ethereum",
                from_address="0x28c6c06298d514db089934071355e5743bf21d60",
                to_address="0x1111111254fb6c44bac0bed2854e76f90643097d",
                amount=31.8,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=58),
                block_number=19420290,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            ),
            # Peel branch to Demo Exchange Beta Deposit Pool (VASP-BETA candidate 2)
            Transaction(
                transaction_hash="0xaa11111111111111111111111111111111111111111111111111111111111111",
                chain="ethereum",
                from_address="0xaaaa111122223333444455556666777788889999",
                to_address="0xdfd5293d8e347dfe59e90efd55b295681375f22d",
                amount=8.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=65),
                block_number=19420325,
                transaction_type="DEPOSIT",
                gas=0.0031,
                status="SUCCESS",
                source="DEMO"
            ),
            # Additional context transactions in the cluster
            Transaction(
                transaction_hash="0xaa12121212121212121212121212121212121212121212121212121212121212",
                chain="ethereum",
                from_address="0xaaaa111122223333444455556666777788889999",
                to_address="0x5555555555555555555555555555555555555555",
                amount=5.0,
                token="NATIVE",
                token_symbol="ETH",
                timestamp=base_time + timedelta(minutes=72),
                block_number=19420360,
                transaction_type="TRANSFER",
                gas=0.0021,
                status="SUCCESS",
                source="DEMO"
            )
        ]

        for tx in demo_txs:
            if not db.query(Transaction).filter(Transaction.transaction_hash == tx.transaction_hash).first():
                db.add(tx)
        db.commit()
        print("✓ Seeded deterministic demo transactions.")

        # 6. Seed Demo Attributions for suspect_wallet
        if not db.query(Attribution).filter(Attribution.wallet_address == suspect_wallet).first():
            attributions = [
                Attribution(
                    wallet_address=suspect_wallet,
                    vasp_id="VASP-ALPHA",
                    vasp_name="Demo Exchange Alpha",
                    confidence=91.4,
                    hop_distance=3,
                    interaction_count=14,
                    total_volume=31.8,
                    score_breakdown={
                        "address_cluster_match": 28.5, # out of 30
                        "interaction_strength": 23.4,  # out of 25
                        "hop_distance_proximity": 18.0,# out of 20
                        "volume_similarity": 13.0,     # out of 15
                        "temporal_pattern": 8.5        # out of 10
                    },
                    evidence_list=[
                        "Direct multi-hop traversal to verified VASP deposit cluster (0x28c6c...)",
                        "Consistent 3-hop transaction path completed in under 60 minutes",
                        "High volume parity: 32.0 ETH sent in Hop 2 vs 31.8 ETH ingested at deposit gateway",
                        "Immediate automated internal sweep from deposit cluster to primary hot wallet (0x11111...)"
                    ],
                    supporting_transactions=[
                        "0xaa02020202020202020202020202020202020202020202020202020202020202",
                        "0xaa07070707070707070707070707070707070707070707070707070707070707",
                        "0xaa09090909090909090909090909090909090909090909090909090909090909",
                        "0xaa10101010101010101010101010101010101010101010101010101010101010"
                    ]
                ),
                Attribution(
                    wallet_address=suspect_wallet,
                    vasp_id="VASP-BETA",
                    vasp_name="Demo Exchange Beta",
                    confidence=64.2,
                    hop_distance=3,
                    interaction_count=5,
                    total_volume=8.0,
                    score_breakdown={
                        "address_cluster_match": 18.0,
                        "interaction_strength": 15.2,
                        "hop_distance_proximity": 16.0,
                        "volume_similarity": 9.0,
                        "temporal_pattern": 6.0
                    },
                    evidence_list=[
                        "Secondary peel-chain route terminates at registered VASP-BETA deposit pool (0xdfd52...)",
                        "Lower volumetric fraction (8.0 ETH out of initial 85.0 ETH pool)",
                        "Indirect path via intermediary peel wallet 0xaaaa1..."
                    ],
                    supporting_transactions=[
                        "0xaa08080808080808080808080808080808080808080808080808080808080808",
                        "0xaa11111111111111111111111111111111111111111111111111111111111111"
                    ]
                ),
                Attribution(
                    wallet_address=suspect_wallet,
                    vasp_id="VASP-GAMMA",
                    vasp_name="Demo Custodian Gamma",
                    confidence=28.5,
                    hop_distance=4,
                    interaction_count=1,
                    total_volume=2.0,
                    score_breakdown={
                        "address_cluster_match": 8.0,
                        "interaction_strength": 5.5,
                        "hop_distance_proximity": 8.0,
                        "volume_similarity": 4.0,
                        "temporal_pattern": 3.0
                    },
                    evidence_list=[
                        "Distant 4-hop counterparty connection through third-party OTC liquidity",
                        "Minimal volumetric interaction",
                        "No direct deposit clustering observed"
                    ],
                    supporting_transactions=[]
                )
            ]
            db.add_all(attributions)
            db.commit()
            print("✓ Seeded demo attributions.")

        # 7. Seed Demo Risk Assessment & Typologies
        if not db.query(RiskAssessment).filter(RiskAssessment.wallet_address == suspect_wallet).first():
            risk_assessment = RiskAssessment(
                wallet_address=suspect_wallet,
                risk_score=94.5,
                risk_level="CRITICAL",
                signals=[
                    "Multi-hop rapid layering fund movement (< 1 hour hop cadence)",
                    "Direct mixer interaction detected (DemoMixer Cash)",
                    "Cross-chain asset bridge gateway interaction (DemoBridge Protocol)",
                    "Substantial fan-out distribution pattern to secondary wallets",
                    "Rapid off-ramp destination targeting centralized VASP deposit cluster"
                ],
                details={
                    "velocity_score": 96.0,
                    "mixer_exposure_score": 98.0,
                    "bridge_exposure_score": 75.0,
                    "layering_complexity_score": 92.0,
                    "sanction_proximity_score": 20.0
                }
            )
            db.add(risk_assessment)

            typologies = [
                TypologyDetection(
                    wallet_address=suspect_wallet,
                    case_id="CASE-DEMO-182",
                    pattern_type="LAYERING",
                    confidence=93.0,
                    supporting_txs=[
                        "0xaa02020202020202020202020202020202020202020202020202020202020202",
                        "0xaa07070707070707070707070707070707070707070707070707070707070707",
                        "0xaa09090909090909090909090909090909090909090909090909090909090909"
                    ],
                    explanation="Pattern consistent with potential layering: Sequential multi-hop transfers through intermediary addresses designed to obscure original fund origin before reaching exchange liquidation."
                ),
                TypologyDetection(
                    wallet_address=suspect_wallet,
                    case_id="CASE-DEMO-182",
                    pattern_type="RAPID_MOVEMENT",
                    confidence=95.0,
                    supporting_txs=[
                        "0xaa02020202020202020202020202020202020202020202020202020202020202",
                        "0xaa07070707070707070707070707070707070707070707070707070707070707"
                    ],
                    explanation="Funds were moved within 15-20 minutes across 3 distinct wallet hops, indicating automated scripted disbursement rather than organic human user behaviour."
                ),
                TypologyDetection(
                    wallet_address=suspect_wallet,
                    case_id="CASE-DEMO-182",
                    pattern_type="MIXER_INTERACTION",
                    confidence=98.0,
                    supporting_txs=[
                        "0xaa05050505050505050505050505050505050505050505050505050505050505"
                    ],
                    explanation="Target wallet executed a direct deposit of 5.0 ETH into recognized privacy mixer contract 0xd90e2f9... (DemoMixer Cash)."
                ),
                TypologyDetection(
                    wallet_address=suspect_wallet,
                    case_id="CASE-DEMO-182",
                    pattern_type="FAN_OUT",
                    confidence=86.0,
                    supporting_txs=[
                        "0xaa03030303030303030303030303030303030303030303030303030303030303",
                        "0xaa04040404040404040404040404040404040404040404040404040404040404"
                    ],
                    explanation="Suspect address disbursed splintered amounts to multiple newly generated addresses within contiguous blocks."
                ),
                TypologyDetection(
                    wallet_address=suspect_wallet,
                    case_id="CASE-DEMO-182",
                    pattern_type="PEEL_CHAIN",
                    confidence=88.0,
                    supporting_txs=[
                        "0xaa08080808080808080808080808080808080808080808080808080808080808",
                        "0xaa11111111111111111111111111111111111111111111111111111111111111"
                    ],
                    explanation="Iterative peeling observed: Primary trunk transferred to Wallet B while smaller remainder was diverted via Peel Intermediary X to secondary exchange."
                ),
                TypologyDetection(
                    wallet_address=suspect_wallet,
                    case_id="CASE-DEMO-182",
                    pattern_type="BRIDGE_INTERACTION",
                    confidence=82.0,
                    supporting_txs=[
                        "0xaa06060606060606060606060606060606060606060606060606060606060606"
                    ],
                    explanation="Identified 10.0 ETH transfer to DemoBridge Protocol gateway for cross-chain liquidity movement."
                )
            ]
            db.add_all(typologies)
            db.commit()
            print("✓ Seeded demo risk assessment and typologies.")

        # 8. Seed Initial Audit Logs
        if not db.query(AuditLog).first():
            logs = [
                AuditLog(
                    username="system_init",
                    action="SYSTEM_INITIALIZED",
                    case_id=None,
                    details={"version": "1.0.0", "environment": "demo"},
                    ip_address="127.0.0.1"
                ),
                AuditLog(
                    username="investigator_rajesh",
                    action="CASE_CREATED",
                    case_id="CASE-DEMO-182",
                    details={"title": "Operation CryptoTrace", "priority": "CRITICAL"},
                    ip_address="127.0.0.1"
                ),
                AuditLog(
                    username="investigator_rajesh",
                    action="WALLET_ANALYZED",
                    case_id="CASE-DEMO-182",
                    details={"wallet": suspect_wallet, "blockchain": "ethereum", "hops": 4},
                    ip_address="127.0.0.1"
                )
            ]
            db.add_all(logs)
            db.commit()
            print("✓ Seeded demo audit logs.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
