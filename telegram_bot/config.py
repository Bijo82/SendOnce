# ==========================================
# SendOnce Telegram Bot Configuration
# ==========================================

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# ==========================================
# Environment Variables
# ==========================================

BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = os.getenv("API_URL")
PORT = int(os.getenv("PORT", "10000"))
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET")
# ==========================================
# Application Constants
# ==========================================

WEBSITE_URL = "https://send-once-azure.vercel.app"

BOT_VERSION = "1.0"

OTP_VALIDITY = "10 Minutes"

APP_NAME = "SendOnce"

AUTHOR = "Shadow Fletch"