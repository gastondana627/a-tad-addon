import requests
from bs4 import BeautifulSoup
import re

def scrape_url_content(url):
    """
    Scrapes the main text content from a given URL.
    This function is designed to be called by the main app.py server.

    Args:
        url (str): The URL of the webpage to scrape.

    Returns:
        dict: A dictionary containing either the scraped text content
              or an error message.
    """
    try:
        # Set headers to mimic a real browser visit
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        print(f"Fetching content from: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        
        # Raise an exception if the request returned an error (e.g., 404, 500)
        response.raise_for_status()
        
        # Use BeautifulSoup to parse the HTML content
        soup = BeautifulSoup(response.content, "html.parser")
        
        # --- Extracting Main Content ---
        # A common strategy is to get all text from the <body> tag.
        # This gives the AI the richest possible context.
        body_text = soup.body.get_text(separator=' ', strip=True)
        
        # Clean up the text: remove multiple spaces and newlines
        cleaned_text = re.sub(r'\s+', ' ', body_text).strip()
        
        print("Successfully scraped text content.")
        
        # Return the scraped data in a dictionary
        return {
            "success": True,
            "url": url,

            # We return a slice of the text to keep it manageable for the MVP
            "text_content": cleaned_text[:4000] # Limit to first 4000 characters
        }

    except requests.exceptions.RequestException as e:
        error_message = f"Failed to fetch the URL: {e}"
        print(error_message)
        return {"success": False, "error": error_message}
    except Exception as e:
        error_message = f"An error occurred during scraping: {e}"
        print(error_message)
        return {"success": False, "error": error_message}

# Note: The Flask server code has been removed from this file.
# The main server logic will now live in app.py.





    