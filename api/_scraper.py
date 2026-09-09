"""
_scraper.py — Shared scraping utility for Vercel serverless functions.
Uses only requests + BeautifulSoup (no Selenium, no colorgram — 
neither runs in Vercel's Python runtime).
CSS color extraction is done via regex instead of image processing.
"""
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

# ── Color extraction from CSS / inline styles ──────────────────────────────

HEX_RE = re.compile(r"#([0-9a-fA-F]{6})\b")

# Colours to ignore (near-black, near-white, common resets)
_SKIP = {
    "000000", "ffffff", "111111", "222222", "333333",
    "444444", "eeeeee", "f0f0f0", "fafafa", "cccccc",
}

def _extract_colors_from_html(html: str, limit: int = 8) -> list[str]:
    """Pull distinct hex colours from inline styles and <style> blocks."""
    seen: dict[str, int] = {}
    for m in HEX_RE.finditer(html):
        h = m.group(1).lower()
        if h not in _SKIP:
            seen[h] = seen.get(h, 0) + 1

    # Sort by frequency, take the top `limit`
    ranked = sorted(seen.items(), key=lambda x: -x[1])
    return [f"#{h}" for h, _ in ranked[:limit]]


# ── Main scrape function ───────────────────────────────────────────────────

def scrape_url(url: str) -> dict:
    """
    Fetch a URL and return structured brand data.
    Returns { success, data } or { success: False, error }.
    """
    try:
        resp = requests.get(url, headers=HEADERS, timeout=12)
        resp.raise_for_status()
    except requests.RequestException as e:
        return {"success": False, "error": f"Could not fetch URL: {e}"}

    html = resp.text
    soup = BeautifulSoup(html, "html.parser")

    # Title
    title = soup.title.string.strip() if soup.title else ""

    # Meta description
    desc_tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    description = desc_tag["content"].strip() if desc_tag and desc_tag.get("content") else ""

    # Meta keywords
    kw_tag = soup.find("meta", attrs={"name": re.compile(r"^keywords$", re.I)})
    keywords = (
        [k.strip() for k in kw_tag["content"].split(",")]
        if kw_tag and kw_tag.get("content") else []
    )

    # Open Graph extras
    og_title = ""
    og_desc = ""
    for tag in soup.find_all("meta", property=re.compile(r"^og:")):
        prop = tag.get("property", "")
        content = tag.get("content", "").strip()
        if prop == "og:title":
            og_title = content
        elif prop == "og:description":
            og_desc = content

    # Body text (script/style stripped)
    for el in soup(["script", "style", "noscript"]):
        el.decompose()
    body_text = re.sub(r"\s+", " ", soup.get_text(" ", strip=True))

    # Images (absolute URLs, skip data URIs)
    images = list({
        urljoin(url, img["src"])
        for img in soup.find_all("img", src=True)
        if not img["src"].startswith("data:")
    })[:20]

    # Colors from CSS in the raw HTML
    colors = _extract_colors_from_html(html)

    return {
        "success": True,
        "data": {
            "title":       og_title or title,
            "description": og_desc or description,
            "keywords":    keywords,
            "colors":      colors,
            "images":      images,
            "body_text":   body_text[:3000],  # cap for token budget
        },
    }
