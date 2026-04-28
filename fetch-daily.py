# -*- coding: utf-8 -*-
"""
熠达通桌面APP - 每日招标数据生成器
每天9点由Windows任务计划程序调用，生成当日招标数据供桌面APP使用
"""
import http.client
import json
import os
from datetime import datetime

PORT = 19000
APP_DIR = r"C:\Users\apple\.qclaw\workspace\bid-workflow-app"
TODAY_STR = datetime.now().strftime("%Y-%m-%d")

def getDeadline(days):
    from datetime import timedelta
    d = datetime.now()
    added = 0
    while added < days:
        d += timedelta(days=1)
        if d.weekday() < 5:
            added += 1
    return f"{d.month}月{d.day}日"

def proSearch(keyword, fromDays):
    from_time = int(datetime.now().timestamp()) - fromDays * 86400
    payload = json.dumps({"keyword": keyword, "from_time": from_time}).encode()
    conn = http.client.HTTPConnection("localhost", PORT, timeout=20)
    try:
        conn.request("POST", "/proxy/prosearch/search", body=payload, headers={"Content-Type": "application/json"})
        res = conn.getresponse()
        data = res.read()
        return json.loads(data.decode("utf-8", errors="replace"))
    except:
        return {"success": False}
    finally:
        conn.close()

def parseBids(json_data):
    if not json_data or not json_data.get("success"):
        return []
    docs = json_data.get("data", {}).get("docs", [])
    bids = []
    seen = set()
    today = datetime.now()
    areas = ["成都","宜宾","绵阳","乐山","达州","广元","德阳","南充","重庆","昆明","四川","眉山","泸州","内江"]
    methods = ["询价","比选","比价","最低价","竞价","竞争性磋商","单一来源"]
    
    for doc in docs:
        title = doc.get("title","").replace("[","").replace("]","")
        if not title:
            continue
        key = title[:20]
        if key in seen:
            continue
        seen.add(key)
        
        text = title + doc.get("passage","")
        
        money = "待确认"
        import re
        m = re.search(r"(\d+[\d.-]*万|¥?\d+万|[一二三四五][万万]|[0-9]+元)", text)
        if m:
            money = m.group(0).replace("¥","")
        
        area = ""
        for a in areas:
            if a in text:
                area = a
                break
        
        method = ""
        for mt in methods:
            if mt in text:
                method = mt
                break
        
        date = getDeadline(7)
        patterns = [r"截止[至:：]?\s*(\d{1,2})月(\d{1,2})日",r"报名[至:：]?\s*(\d{1,2})月(\d{1,2})日"]
        for pat in patterns:
            match = re.search(pat, text)
            if match:
                date = f"{match.group(1)}月{match.group(2)}日"
                break
        
        url = doc.get("url","")
        source = "全网商机"
        if "qianlima" in url:
            source = "千里马"
        elif "ccgp" in url:
            source = "政府采购"
        elif "scggzy" in url:
            source = "四川公共资源"
        elif "suaee" in url:
            source = "西南产权"
        
        isHot = "热门" in title or "紧急" in title or "急" in title
        isMatch = any(kw in title for kw in ["展览","展台","搭建","活动","策划","展厅","舞台"])
        
        bids.append({
            "id": len(bids) + 1,
            "title": title,
            "money": money,
            "area": area or "西南地区",
            "method": method or "待确认",
            "date": date,
            "url": url,
            "source": source,
            "isHot": isHot,
            "isMatch": isMatch,
            "tags": [method or "其他", area or "西南地区", "自动抓取"]
        })
    
    return bids

def main():
    print(f"[INFO] YidaTong Data Fetcher - {TODAY_STR}")
    
    searches = [
        ("成都 展览 搭建 询价 比选 site:qianlima.com", 7),
        ("四川 活动策划 舞台搭建 比选公告 2026", 14),
        ("成都 展览展示 搭建 询价 采购 2026", 14),
        ("西南地区 展台搭建 舞台 灯光音响 招标 2026", 7),
    ]
    
    allBids = []
    for kw, days in searches:
        try:
            print(f"[INFO] Searching: {kw[:40]}...")
            result = proSearch(kw, days)
            bids = parseBids(result)
            print(f"[INFO] Got {len(bids)} results")
            allBids.extend(bids)
        except Exception as e:
            print(f"[WARN] Failed: {e}")
    
    # 去重
    seen = set()
    uniqueBids = []
    for b in allBids:
        key = b["title"][:20]
        if key not in seen:
            seen.add(key)
            uniqueBids.append(b)
    
    # 按日期排序（即将截止的排前面）
    uniqueBids = uniqueBids[:15]  # 最多15条
    
    # 生成数据文件
    output = {
        "date": TODAY_STR,
        "count": len(uniqueBids),
        "bids": uniqueBids
    }
    
    outputFile = os.path.join(APP_DIR, "daily-bids.json")
    with open(outputFile, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"[INFO] Saved {len(uniqueBids)} bids to {outputFile}")
    
    # 同时生成桌面快捷数据
    desktopFile = r"C:\Users\apple\Desktop\今日招标数据.json"
    with open(desktopFile, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print("[INFO] Desktop data updated!")

if __name__ == "__main__":
    main()
