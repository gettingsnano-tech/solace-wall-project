import secrets

def generate_tx_hash():
    """Generates a random simulated transaction hash (hex string)."""
    return "0x" + secrets.token_hex(32)

def generate_random_address():
    """Generates a random simulated wallet address."""
    return "0x" + secrets.token_hex(20)
