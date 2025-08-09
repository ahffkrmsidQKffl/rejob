#!/usr/bin/env python
# coding: utf-8

# In[ ]:


# -*- coding: utf-8 -*-
import os, json, re, hashlib
from datetime import datetime
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path
FRONT_PUBLIC = (Path(__file__).resolve().parents[1] / "frontend" / "public")
FRONT_PUBLIC.mkdir(parents=True, exist_ok=True)

# TF 끄기(안전)
os.environ.setdefault("TRANSFORMERS_NO_TF","1")
os.environ.setdefault("TRANSFORMERS_NO_FLAX","1")
os.environ.setdefault("USE_TF","0")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

@app.route("/run", methods=["POST", "OPTIONS"])
@cross_origin(origins="*", methods=["POST","OPTIONS"], headers=["Content-Type"])
def run_all():
    # 프리플라이트 대응
    if request.method == "OPTIONS":
        resp = make_response("", 204)
        # 명시적으로 추가(일부 환경에서 필요)
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return resp

    user = request.get_json(force=True) or {}
    # TODO: 추천 실행 + public에 CSV 저장
    return jsonify({"ok": True})

TODAY = datetime.now().date()
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
model = SentenceTransformer(MODEL_NAME)

# --------- 공통 유틸 ---------
def to_int(x):
    if pd.isna(x): return 0
    if isinstance(x,(int,float)): return int(x)
    s = re.sub(r"[^\d]","",str(x))
    return int(s) if s.isdigit() else 0

TIME_MAP = {"오전":"morning","오후":"afternoon","저녁":"evening","야간":"night","평일":"weekday","주말":"weekend",
            "월":"mon","화":"tue","수":"wed","목":"thu","금":"fri","토":"sat","일":"sun"}

def time_overlap(job_time_text, prefs):
    if not isinstance(job_time_text,str) or not prefs: return 0.0
    found = set(t for k,t in TIME_MAP.items() if k in job_time_text)
    if not found: return 0.0
    inter = found & set(prefs)
    return len(inter)/max(1,len(found))

def region_score(txt, sido, gu):
    t = (txt or "")
    s=0.0
    if sido and sido in t: s+=0.6
    if gu and gu in t: s+=0.4
    return min(1.0,s)

def keyword_score(text, keys):
    if not keys: return 0.0
    t = (text or "").lower()
    hit = sum(1 for k in keys if str(k).lower() in t)
    return min(1.0, hit/5)

def constraint_penalty(text, cons):
    if not cons: return 0.0
    t = (text or "").lower()
    hit = sum(1 for k in cons if str(k).lower() in t)
    return min(1.0, hit/2)

def wage_score(wage_text, min_wage):
    if not min_wage or int(min_wage)<=0: return 0.5
    w = to_int(wage_text)
    if w<=0: return 0.0
    return 1.0 if w>=int(min_wage) else 0.3

def cosine(a,b):
    den = (np.linalg.norm(a)*np.linalg.norm(b))
    return 0.0 if den==0 else float(np.dot(a,b)/den)

def encode_texts(texts):  # numpy
    return model.encode([t or "" for t in texts], convert_to_numpy=True, normalize_embeddings=False)

def encode_query(user):
    # 단일 쿼리 문장 구성 (공통)
    parts=[]
    if user.get("keywords"): parts.append(" ".join(user["keywords"]))
    if user.get("employmentType"): parts.append(user["employmentType"])
    if user.get("activityType"): parts.append(user["activityType"])
    av = user.get("availability") or {}
    on = [k for k,v in av.items() if v]
    if on: parts.append(" ".join(sorted(on)))
    if user.get("freeText"): parts.append(user["freeText"])
    q = " ".join(parts) or "일자리 추천"
    return encode_texts([q])[0]

# --------- korea 전용 ---------
date_pat = re.compile(r"(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})")
def is_active_today(period):
    if not isinstance(period,str): return True
    m = date_pat.search(period)
    if not m: return True
    try:
        end = datetime.strptime(m.group(2), "%Y-%m-%d").date()
        return TODAY <= end
    except: return True

KOREA_CSV = "korea_jobs_fixed16_final.csv"
df_korea = pd.read_csv(KOREA_CSV, encoding="utf-8-sig")

@app.post("/recommend/korea")
def recommend_korea():
    user = request.get_json(force=True) or {}
    sido = (user.get("region") or {}).get("sido")
    gu   = (user.get("region") or {}).get("gu")
    prefs = {k for k,v in (user.get("availability") or {}).items() if v}

    work = df_korea[df_korea["모집기간"].map(is_active_today)].copy()

    # 규칙 점수(원본 로직)
    def rule_row(r):
        txtAll = f"{r.get('직무요약','')} {r.get('직무내용','')}"
        s=0.0
        s += 30*region_score(f"{r.get('기관소재지','')} {r.get('근무지역(상세)','')}", sido, gu)
        s += 20*(1.0 if (user.get("activityType") and str(r.get("사업유형","")).find(user["activityType"])!=-1) else 0.3)
        s += 15*time_overlap(str(r.get("주근무시간","")), prefs)
        s += 15*keyword_score(txtAll, user.get("keywords") or [])
        planned, joined = to_int(r.get("계획인원")), to_int(r.get("참여인원"))
        left_to = max(0.0, (planned-joined)/planned) if planned>0 else 0.0
        s += 10*left_to
        s += 10*wage_score(r.get("임금액"), user.get("minWage"))
        s -= 20*constraint_penalty(txtAll, user.get("constraints") or [])
        return s

    work["rule_raw"]=work.apply(rule_row, axis=1)
    rmin, rmax = work["rule_raw"].min(), work["rule_raw"].max()
    work["rule_score"] = (work["rule_raw"]-rmin)/(rmax-rmin) if rmax>rmin else 0.0

    # 임베딩 유사도
    work["직무텍스트"] = work["직무요약"].fillna("")+" "+work["직무내용"].fillna("")
    job_emb = encode_texts(work["직무텍스트"].tolist())
    q = encode_query(user)
    sims = np.array([cosine(v,q) for v in job_emb])
    work["sim_score"] = (sims+1.0)/2.0

    work["final_score"] = 0.5*work["rule_score"] + 0.5*work["sim_score"]

    # 추천근거
    def reasons(r):
        parts=[]
        parts.append(f"지역매칭 {region_score(f'{r.get('기관소재지','')} {r.get('근무지역(상세)','')}', sido, gu):.2f}")
        if user.get("activityType"):
            parts.append("유형 "+("일치" if user["activityType"] in str(r.get("사업유형","")) else "부분"))
        if prefs:
            parts.append(f"시간대겹침 {time_overlap(str(r.get('주근무시간','')), prefs):.2f}")
        if user.get("keywords"):
            parts.append(f"키워드정합 {keyword_score(f'{r.get('직무요약','')} {r.get('직무내용','')}', user['keywords']):.2f}")
        parts.append(f"유사도 {r.get('sim_score',0):.2f}")
        return " · ".join(parts)

    work["추천근거"]=work.apply(reasons, axis=1)

    # 원본 전 컬럼 + 점수
    extra_cols = ["rule_score","sim_score","final_score","추천근거"]
    out_cols = list(df_korea.columns) + extra_cols
    out = work.sort_values("final_score", ascending=False).head(20)[out_cols]
    
    # 📌 CSV 저장
    out.to_csv(FRONT_PUBLIC/"recommendations_korea.csv", index=False, encoding="utf-8-sig")
    return out.to_json(force_ascii=False, orient="records")

# --------- senior 전용 ---------
SENIOR_CSV = "senior_jobs_fixed.csv"
df_senior = pd.read_csv(SENIOR_CSV, encoding="utf-8-sig")

def is_open(exp):
    if pd.isna(exp): return True
    try:
        end = datetime.fromisoformat(str(exp).replace("Z","+00:00")).date()
        return TODAY <= end
    except: return True

@app.post("/recommend/senior")
def recommend_senior():
    user = request.get_json(force=True) or {}
    sido = (user.get("region") or {}).get("sido")
    gu   = (user.get("region") or {}).get("gu")
    prefs = {k for k,v in (user.get("availability") or {}).items() if v}

    work = df_senior[df_senior["expiration"].map(is_open)].copy()

    def rule_row(r):
        textAll = f"{r.get('title','')} {r.get('keyword','')}"
        s=0.0
        s += 30*region_score(r.get("location",""), sido, gu)
        s += 20*(1.0 if (user.get("employmentType") and str(r.get("employment_type","")).find(user["employmentType"])!=-1) else 0.3)
        s += 15*time_overlap(str(r.get("work_hours","")), prefs)
        s += 15*keyword_score(textAll, user.get("keywords") or [])
        s += 10*wage_score(r.get("salary"), user.get("minWage"))
        s -= 20*constraint_penalty(textAll, user.get("constraints") or [])
        return s

    work["rule_raw"]=work.apply(rule_row, axis=1)
    rmin, rmax = work["rule_raw"].min(), work["rule_raw"].max()
    work["rule_score"] = (work["rule_raw"]-rmin)/(rmax-rmin) if rmax>rmin else 0.0

    # 임베딩 유사도 (title+keyword+employment_type)
    work["job_text"] = (
        work["title"].fillna("")+" "+
        work["keyword"].fillna("")+" "+
        work["employment_type"].fillna("")
    )
    job_emb = encode_texts(work["job_text"].tolist())
    q = encode_query(user)
    sims = np.array([cosine(v,q) for v in job_emb])
    work["sim_score"] = (sims+1.0)/2.0

    work["final_score"] = 0.5*work["rule_score"] + 0.5*work["sim_score"]

    def reasons(r):
        parts=[]
        parts.append(f"지역매칭 {region_score(r.get('location',''), sido, gu):.2f}")
        if user.get("employmentType"):
            parts.append("고용형태 "+("일치" if user["employmentType"] in str(r.get("employment_type","")) else "부분"))
        if prefs:
            parts.append(f"시간대겹침 {time_overlap(str(r.get('work_hours','')), prefs):.2f}")
        if user.get("keywords"):
            parts.append(f"키워드정합 {keyword_score(f'{r.get('title','')} {r.get('keyword','')}', user['keywords']):.2f}")
        parts.append(f"유사도 {r.get('sim_score',0):.2f}")
        return " · ".join(parts)

    work["추천근거"]=work.apply(reasons, axis=1)

    extra_cols = ["rule_score","sim_score","final_score","추천근거"]
    out_cols = list(df_senior.columns) + extra_cols
    out = work.sort_values("final_score", ascending=False).head(20)[out_cols]
    
    # 📌 CSV 저장
    out.to_csv(FRONT_PUBLIC/"recommendations_senior.csv", index=False, encoding="utf-8-sig")
    return out.to_json(force_ascii=False, orient="records")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

