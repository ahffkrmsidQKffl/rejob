
import csv, json, statistics
from pathlib import Path


TEMPLATE = [
    {"user_id": "u001", "endpoint": "/recommend/korea", "liked_rowids": ""},
    {"user_id": "u002", "endpoint": "/recommend/senior", "liked_rowids": ""},
]

TEMPLATE_PATH = Path("feedback_template.csv")
RESULT_PATH = Path("quality_results.csv")

def ensure_template():
    if not TEMPLATE_PATH.exists():
        with TEMPLATE_PATH.open("w", newline="", encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=["user_id","endpoint","liked_rowids"])
            w.writeheader()
            for row in TEMPLATE:
                w.writerow(row)
        print(f"[INFO] Created template: {TEMPLATE_PATH}")
    else:
        print(f"[INFO] Template already exists: {TEMPLATE_PATH}")

def precision_at_k(top_ids, liked_ids, k=5):
    if not top_ids or not liked_ids: return 0.0
    topk = top_ids[:k]
    hit = len(set(topk) & set(liked_ids))
    return hit / float(k)

def fetch_top_ids(endpoint, user_payload):
    import requests
    BASE_URL = "http://localhost:5001"
    r = requests.post(BASE_URL + endpoint, json=user_payload, timeout=30)
    r.raise_for_status()
    data = r.json()
    # Prefer _rowid if present; fallback to hash of title
    ids = []
    for x in data:
        if "_rowid" in x:
            ids.append(int(x["_rowid"]))
        elif "title" in x:
            ids.append(abs(hash(x["title"])) % (10**9))
        else:
            ids.append(abs(hash(json.dumps(x, ensure_ascii=False))) % (10**9))
    return ids, data

# Minimal user payloads per endpoint (should match your service)
DEFAULT_PAYLOADS = {
    "/recommend/korea": {
        "region": {"sido": "서울특별시", "gu": "강남구"},
        "activityType": "공익활동",
        "employmentType": "파트타임",
        "availability": {"평일": True, "오전": True},
        "keywords": ["복지","상담"],
        "minWage": 10000,
        "constraints": [],
        "freeText": ""
    },
    "/recommend/senior": {
        "region": {"sido": "경기도", "gu": "성남시"},
        "employmentType": "계약직",
        "availability": {"오후": True, "주말": True},
        "keywords": ["안내"],
        "minWage": 0,
        "constraints": [],
        "freeText": ""
    }
}

def main():
    ensure_template()
    fb_path = Path("feedback.csv")
    if not fb_path.exists():
        print(f"[WARN] No feedback.csv found. Please copy {TEMPLATE_PATH.name} to feedback.csv and fill liked_rowids.")
        return

    rows = []
    with fb_path.open("r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            endpoint = row["endpoint"].strip()
            liked = [int(x) for x in row["liked_rowids"].split(",") if x.strip().isdigit()]
            payload = DEFAULT_PAYLOADS.get(endpoint, {})
            top_ids, data = fetch_top_ids(endpoint, payload)
            p5 = precision_at_k(top_ids, liked, k=5)
            p3 = precision_at_k(top_ids, liked, k=3)
            # Mean sim_score of liked items (if present)
            sim_scores = []
            for x in data:
                rid = int(x.get("_rowid", -1)) if "_rowid" in x else None
                if rid is not None and rid in liked and "sim_score" in x:
                    try:
                        sim_scores.append(float(x["sim_score"]))
                    except Exception:
                        pass
            sim_mean = statistics.mean(sim_scores) if sim_scores else 0.0

            rows.append({
                "user_id": row["user_id"],
                "endpoint": endpoint,
                "precision@3": p3,
                "precision@5": p5,
                "liked_sim_mean": sim_mean,
                "liked_count": len(liked),
            })

    # Save
    with RESULT_PATH.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    print(f"[OK] Saved: {RESULT_PATH}")
    try:
        from tabulate import tabulate
        print(tabulate(rows, headers="keys", floatfmt=".3f"))
    except Exception:
        print(json.dumps(rows, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
