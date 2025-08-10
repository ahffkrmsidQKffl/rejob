
import time, json, statistics, requests
from pathlib import Path

# ==== CONFIG ====
BASE_URL = "http://localhost:5001"   # change if needed
N_RUNS_PER_PROFILE = 5               # repetitions for latency stability
ENDPOINTS = ["/recommend/korea", "/recommend/senior"]

# Example user profiles covering different combinations.
SAMPLE_USERS = [
    {
        "region": {"sido": "서울특별시", "gu": "강남구"},
        "activityType": "공익활동",
        "employmentType": "파트타임",
        "availability": {"평일": True, "오전": True, "오후": False, "주말": False},
        "keywords": ["복지", "상담"],
        "minWage": 10000,
        "constraints": ["야간"],
        "freeText": "사무보조나 상담 같은 가벼운 업무 원함"
    },
    {
        "region": {"sido": "경기도", "gu": "성남시"},
        "activityType": "시장형",
        "employmentType": "계약직",
        "availability": {"주말": True, "오전": False, "오후": True},
        "keywords": ["도서관", "안내"],
        "minWage": 0,
        "constraints": [],
        "freeText": "실내, 안내 위주"
    },
    {
        "region": {"sido": "부산광역시", "gu": "해운대구"},
        "activityType": "사회서비스형",
        "employmentType": "상용직",
        "availability": {"평일": True, "오전": False, "오후": True},
        "keywords": ["시설관리"],
        "minWage": 10500,
        "constraints": ["장거리"],
        "freeText": "이동 적고 가까운 곳 선호"
    },
]

def p95(xs):
    if not xs: return 0.0
    xs_sorted = sorted(xs)
    k = int(round(0.95 * (len(xs_sorted)-1)))
    return xs_sorted[k]

def run_one(endpoint, payload):
    url = BASE_URL + endpoint
    t0 = time.perf_counter()
    r = requests.post(url, json=payload, timeout=30)
    dt = (time.perf_counter() - t0) * 1000.0
    r.raise_for_status()
    data = r.json()
    # Sim-score stats on top-5
    top5 = data[:5] if isinstance(data, list) else []
    sim_scores = [float(x.get("sim_score", 0.0)) for x in top5]
    final_scores = [float(x.get("final_score", 0.0)) for x in top5]
    return {
        "latency_ms": dt,
        "count": len(data) if isinstance(data, list) else 0,
        "sim_top1": sim_scores[0] if sim_scores else 0.0,
        "sim_top5_avg": sum(sim_scores)/len(sim_scores) if sim_scores else 0.0,
        "final_top1": final_scores[0] if final_scores else 0.0,
        "final_top5_avg": sum(final_scores)/len(final_scores) if final_scores else 0.0,
    }

def main():
    rows = []
    for ep in ENDPOINTS:
        for i, user in enumerate(SAMPLE_USERS):
            latencies, sim1, sim5, fin1, fin5, counts = [], [], [], [], [], []
            for _ in range(N_RUNS_PER_PROFILE):
                res = run_one(ep, user)
                latencies.append(res["latency_ms"])
                sim1.append(res["sim_top1"])
                sim5.append(res["sim_top5_avg"])
                fin1.append(res["final_top1"])
                fin5.append(res["final_top5_avg"])
                counts.append(res["count"])

            row = {
                "endpoint": ep,
                "profile_idx": i,
                "runs": len(latencies),
                "count_mean": statistics.mean(counts),
                "latency_mean_ms": statistics.mean(latencies),
                "latency_p95_ms": p95(latencies),
                "sim_top1_mean": statistics.mean(sim1),
                "sim_top5_mean": statistics.mean(sim5),
                "final_top1_mean": statistics.mean(fin1),
                "final_top5_mean": statistics.mean(fin5),
            }
            rows.append(row)

    # Save CSV
    import csv
    out_path = Path("benchmark_results.csv")
    with out_path.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"[OK] Saved: {out_path}")

    # Pretty print
    try:
        from tabulate import tabulate
        print(tabulate(rows, headers="keys", floatfmt=".3f"))
    except Exception:
        print(json.dumps(rows, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
