import requests
from bs4 import BeautifulSoup

def scrape_url_content(url):
    """
    Scrapes the text content from a given URL using requests and BeautifulSoup.
    """
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return {"success": False, "error": "Failed to fetch the URL"}

        soup = BeautifulSoup(response.text, 'html.parser')

        # Remove unwanted tags like scripts and styles
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        # Extract readable text
        text = soup.get_text(separator="\n", strip=True)

        return {"success": True, "text_content": text}

    except Exception as e:
        return {"success": False, "error": str(e)}

    