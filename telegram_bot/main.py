# ==========================================
# SendOnce Telegram Bot
# ==========================================

import logging

from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
)

from config import BOT_TOKEN

from handlers import (
    error_handler,
    start,
    help_command,
    about,
    website,
    handle_text,
    handle_document,
    handle_photo,
)

from conversations import (
    download_conversation,
)

# ==========================================
# Logging
# ==========================================

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


# ==========================================
# Main
# ==========================================

def main():

    app = Application.builder().token(BOT_TOKEN).build()

    # -----------------------------
    # Commands
    # -----------------------------

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("about", about))
    app.add_handler(CommandHandler("website", website))
    app.add_error_handler(error_handler)

    # -----------------------------
    # Conversations
    # -----------------------------

    app.add_handler(download_conversation)

    # -----------------------------
    # Upload Handlers
    # -----------------------------

    app.add_handler(
        MessageHandler(
            filters.Document.ALL,
            handle_document
        )
    )

    app.add_handler(
        MessageHandler(
            filters.PHOTO,
            handle_photo
        )
    )

    app.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            handle_text
        )
    )

    # -----------------------------
    # Start Bot
    # -----------------------------

    logger.info("Starting SendOnce Telegram Bot...")

    app.run_polling(
    drop_pending_updates=True,
    bootstrap_retries=5,
    )

# ==========================================
# Entry Point
# ==========================================

if __name__ == "__main__":
    main()