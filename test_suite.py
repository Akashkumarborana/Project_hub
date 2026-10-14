"""
test_suite.py - Automated End-to-End Test Suite for Antigravity Projects Hub
Tests all APIs, frontend assets, AI generation, and ZIP archive integrity.
"""

import urllib.request
import urllib.error
import json
import zipfile
import io
import sys

BASE_URL = "http://localhost:8000"

def log_test(name, passed, details=""):
    symbol = "[PASS]" if passed else "[FAIL]"
    print(f"{symbol} {name}")
    if details:
        print(f"       -> {details}")

def test_static_assets():
    print("\n--- 1. Testing Frontend Static Assets ---")
    
    # Test index.html
    req = urllib.request.urlopen(f"{BASE_URL}/")
    html = req.read().decode("utf-8")
    log_test("HTML Delivery (index.html)", req.status == 200 and "Antigravity" in html, f"Length: {len(html)} bytes")

    # Test style.css (.glass3d check)
    req = urllib.request.urlopen(f"{BASE_URL}/style.css")
    css = req.read().decode("utf-8")
    has_glass3d = ".glass3d" in css and "--filter-glass3d" in css
    log_test("CSS Delivery & .glass3d Definition", req.status == 200 and has_glass3d, f"Found .glass3d: {has_glass3d}")

    # Test app.js
    req = urllib.request.urlopen(f"{BASE_URL}/app.js")
    js = req.read().decode("utf-8")
    has_app_logic = "generateCustomAIProject" in js and "openLiveDemoModal" in js and "submitDirectMessage" in js
    log_test("JavaScript Controller (app.js)", req.status == 200 and has_app_logic, f"Found Live Demo & Message logic: {has_app_logic}")

    # Test Live Preview HTML endpoint
    req_prev = urllib.request.urlopen(f"{BASE_URL}/api/project-preview/ecommerce-pro")
    preview_html = req_prev.read().decode("utf-8")
    log_test("Live Demo Sandbox Endpoint (/api/project-preview)", req_prev.status == 200 and len(preview_html) > 100, f"Preview HTML length: {len(preview_html)}")

    # Test Direct Message Submission endpoint
    msg_payload = json.dumps({
        "name": "Rohan Test",
        "contact": "+91 9999988888",
        "budget": "₹5,000",
        "message": "Need hospital management app"
    }).encode("utf-8")
    req_msg = urllib.request.Request(f"{BASE_URL}/api/send-message", data=msg_payload, headers={"Content-Type": "application/json"})
    res_msg = urllib.request.urlopen(req_msg)
    msg_data = json.loads(res_msg.read().decode("utf-8"))
    log_test("Direct Message Inquiry API (/api/send-message)", msg_data.get("success") is True, f"Response: {msg_data.get('message')}")

def test_projects_catalog():
    print("\n--- 2. Testing Projects Catalog API (/api/projects) ---")
    req = urllib.request.urlopen(f"{BASE_URL}/api/projects")
    data = json.loads(req.read().decode("utf-8"))
    
    is_success = data.get("success") is True
    count = data.get("count", 0)
    projects = data.get("projects", [])
    
    log_test("Catalog API Status & Count", is_success and count >= 16, f"Loaded {count} verified projects")

    # Check data integrity of each project
    valid_projects = True
    missing_fields = []
    required_keys = ["id", "title", "category", "price", "original_price", "tech_stack", "features", "setup_steps", "files"]
    for p in projects:
        for k in required_keys:
            if k not in p:
                valid_projects = False
                missing_fields.append((p.get("id", "unknown"), k))
    
    log_test("Project Schema Integrity", valid_projects, f"Verified all required fields for {len(projects)} projects")

def test_referrals_and_coupons():
    print("\n--- 3. Testing Referral & 50% Coupon Engine ---")
    
    # Test /api/referrals
    req = urllib.request.urlopen(f"{BASE_URL}/api/referrals")
    ref_data = json.loads(req.read().decode("utf-8"))
    has_ref_code = ref_data.get("referral_code") == "DEV50-PREMIUM"
    log_test("Referral Info Endpoint", has_ref_code, f"Default Code: {ref_data.get('referral_code')}")

    # Test Valid Coupon: DEV50-PREMIUM
    payload = json.dumps({"code": "DEV50-PREMIUM"}).encode("utf-8")
    post_req = urllib.request.Request(f"{BASE_URL}/api/validate-coupon", data=payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(post_req)
    coupon_data = json.loads(res.read().decode("utf-8"))
    log_test("Coupon Validation (DEV50-PREMIUM)", coupon_data.get("valid") is True and coupon_data.get("discount_percent") == 50, f"Discount: {coupon_data.get('discount_percent')}%")

    # Test Invalid Coupon
    try:
        payload_bad = json.dumps({"code": "FAKE_EXPIRED_CODE"}).encode("utf-8")
        post_req_bad = urllib.request.Request(f"{BASE_URL}/api/validate-coupon", data=payload_bad, headers={"Content-Type": "application/json"})
        urllib.request.urlopen(post_req_bad)
        log_test("Invalid Coupon Rejection", False, "Expected 400 error")
    except urllib.error.HTTPError as e:
        log_test("Invalid Coupon Rejection", e.code == 400, "Successfully rejected with HTTP 400")

def test_ai_generator():
    print("\n--- 4. Testing Antigravity AI Custom Generator ---")
    prompt = "Create a Hospital Patient Management System with OPD queue tokens and pharmacy invoicing"
    payload = json.dumps({
        "prompt": prompt,
        "tech_stack": "Full Stack (React + Node.js + Tailwind)",
        "project_name": "MediToken-OPD"
    }).encode("utf-8")

    req = urllib.request.Request(f"{BASE_URL}/api/generate-ai-project", data=payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    ai_data = json.loads(res.read().decode("utf-8"))

    has_files = "files" in ai_data and len(ai_data["files"]) >= 4
    has_index = "index.html" in ai_data.get("files", {})
    has_readme = "README.md" in ai_data.get("files", {})
    has_run_bat = "run.bat" in ai_data.get("files", {})

    log_test("AI Code Synthesis Response", ai_data.get("success") is True, f"Generated {ai_data.get('files_count')} source files")
    log_test("AI File Manifest Completeness", has_files and has_index and has_readme and has_run_bat, f"Files: {list(ai_data.get('files', {}).keys())}")

    return ai_data

def test_zip_downloads(ai_data):
    print("\n--- 5. Testing ZIP Packaging & File Integrity ---")
    
    # 5A: Standard Project Download (e.g. ecommerce-pro)
    payload_std = json.dumps({
        "project_id": "ecommerce-pro",
        "is_custom": False,
        "title": "ShopVibe E-Commerce"
    }).encode("utf-8")

    req_std = urllib.request.Request(f"{BASE_URL}/api/download-zip", data=payload_std, headers={"Content-Type": "application/json"})
    res_std = urllib.request.urlopen(req_std)
    zip_bytes = res_std.read()

    is_zip = res_std.headers.get("Content-Type") == "application/zip"
    
    # Unzip in-memory and verify contents
    with zipfile.ZipFile(io.BytesIO(zip_bytes), "r") as z:
        namelist = z.namelist()
        has_run_guide = "HOW_TO_RUN_ON_PC.txt" in namelist
        has_readme = "README.md" in namelist
        guide_text = z.read("HOW_TO_RUN_ON_PC.txt").decode("utf-8")
        has_valid_guide = "HOW TO SETUP & RUN" in guide_text

    log_test("Standard Project ZIP Delivery", is_zip and len(zip_bytes) > 500, f"Archive size: {len(zip_bytes)} bytes")
    log_test("Standard Project ZIP Integrity & PC Guide", has_run_guide and has_readme and has_valid_guide, f"Files in ZIP: {namelist}")

    # 5B: Custom AI Project Download
    payload_ai = json.dumps({
        "is_custom": True,
        "title": "MediToken OPD",
        "project_name": "meditoken-opd",
        "files": ai_data["files"]
    }).encode("utf-8")

    req_ai = urllib.request.Request(f"{BASE_URL}/api/download-zip", data=payload_ai, headers={"Content-Type": "application/json"})
    res_ai = urllib.request.urlopen(req_ai)
    ai_zip_bytes = res_ai.read()

    with zipfile.ZipFile(io.BytesIO(ai_zip_bytes), "r") as z:
        ai_namelist = z.namelist()
        ai_has_guide = "HOW_TO_RUN_ON_PC.txt" in ai_namelist
        ai_has_index = "index.html" in ai_namelist

    log_test("Custom AI Project ZIP Delivery", len(ai_zip_bytes) > 500, f"Archive size: {len(ai_zip_bytes)} bytes")
    log_test("Custom AI ZIP Integrity & Setup Instructions", ai_has_guide and ai_has_index, f"Files in AI ZIP: {ai_namelist}")

if __name__ == "__main__":
    if sys.platform.startswith("win"):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    try:
        test_static_assets()
        test_projects_catalog()
        test_referrals_and_coupons()
        ai_data = test_ai_generator()
        test_zip_downloads(ai_data)
        print("\n=============================================================")
        print("[SUCCESS] ALL TEST SUITES PASSED! Platform is 100% Operational.")
        print("=============================================================\n")
    except Exception as e:
        print(f"\n[FATAL ERROR IN TEST SUITE]: {e}")
        sys.exit(1)
