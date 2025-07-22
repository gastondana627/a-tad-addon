import requests
import colorgram
import io
import re
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# --- (This is the full code from my previous response, combined into one file for your convenience) ---

def _extract_colors_from_images(image_urls, num_colors=6):
    extracted_colors = set()
    for url in image_urls[:5]:
        try:
            response = requests.get(url, timeout=5, stream=True)
            response.raise_for_status()
            image_data = io.BytesIO(response.content)
            colors = colorgram.extract(image_data, num_colors)
            for color in colors:
                extracted_colors.add(color.rgb)
        except Exception:
            continue
    return [f"#{r:02x}{g:02x}{b:02x}" for r, g, b in extracted_colors]

def _parse_html_content(html_content, base_url):
    soup = BeautifulSoup(html_content, 'html.parser')
    title = soup.title.string.strip() if soup.title else ''
    description_tag = soup.find('meta', attrs={'name': 'description'})
    description = description_tag['content'].strip() if description_tag else ''
    keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
    keywords = [k.strip() for k in keywords_tag['content'].split(',')] if keywords_tag else []
    
    if soup.body:
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()
        body_text = ' '.join(soup.body.stripped_strings)
        body_text = re.sub(r'\s+', ' ', body_text)
    else:
        body_text = ''
        
    images = list(set([urljoin(base_url, img.get('src')) for img in soup.find_all('img') if img.get('src') and not img.get('src').startswith('data:')]))
    colors = _extract_colors_from_images(images)

    return {
        "title": title, "description": description, "keywords": keywords,
        "colors": colors, "images": images, "body_text": body_text
    }

def _extract_with_bs(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return _parse_html_content(response.text, url)
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch with BeautifulSoup: {e}"}

def _extract_with_selenium(url):
    options = Options()
    options.add_argument("--headless"); options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.get(url)
        time.sleep(3)
        return _parse_html_content(driver.page_source, url)
    except Exception as e:
        return {"error": f"Failed to parse with Selenium: {e}"}
    finally:
        if driver:
            driver.quit()

# --- Main function to be called by app.py ---
def scrape_url_content(url: str, parser: str = 'bs4'):
    """
    Scrapes a URL using the specified parser ('bs4' or 'selenium').
    Returns a dictionary with success status and data/error.
    """
    if parser == 'selenium':
        print(f"Scraping {url} with Selenium...")
        data = _extract_with_selenium(url)
    else:
        print(f"Scraping {url} with BeautifulSoup...")
        data = _extract_with_bs(url)
        
    if "error" in data:
        return {"success": False, "error": data["error"]}
    
    return {"success": True, "data": data}
    