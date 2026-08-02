from __future__ import annotations

import json
from pathlib import Path
from statistics import median


ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "data" / "public" / "bundle.json"
OUTPUT = ROOT / "data" / "analytics" / "python-analysis.json"


def main() -> None:
    if not BUNDLE.exists():
        raise SystemExit("bundle.json not found. Run `npm run build:data` first.")

    payload = json.loads(BUNDLE.read_text(encoding="utf-8"))
    listings = payload.get("listings", [])
    prices = [row.get("totalPrice", 0) for row in listings if row.get("totalPrice", 0) > 0]

    result = {
        "generatedAt": payload.get("generatedAt"),
        "demo": payload.get("demo", False),
        "listingCount": len(listings),
        "medianTotalPrice": median(prices) if prices else None,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
