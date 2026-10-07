import sys
import os

# Ensure the root directory is in the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app

# Vercel requires the application to be exposed as a variable.
# '@vercel/python' automatically looks for 'app' in index.py
