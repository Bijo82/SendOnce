# ==========================================
# SendOnce Telegram Bot Handlers
# ==========================================
import os
import tempfile

from telegram.error import BadRequest

from uploader import (
    upload_text,
    upload_file,
)

import logging

import requests

from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import ContextTypes

from config import (
    WEBSITE_URL,
    APP_NAME,
    BOT_VERSION,
    OTP_VALIDITY,
)

logger = logging.getLogger(__name__)

# ==========================================
# Success Message
# ==========================================

async def send_success(
    update: Update,
    otp: str,
    filename: str
):

    await update.message.reply_text(

f"""
✅ <b>Upload Successful</b>

📄 <b>File</b>
{filename}

🔐 <b>OTP</b>

<code>{otp}</code>

⏳ Valid for {OTP_VALIDITY}

🌐 Download

{WEBSITE_URL}/share/{otp}

⚠️ This OTP can only be used once.
""",

        parse_mode=ParseMode.HTML,
        disable_web_page_preview=True
    )


# ==========================================
# Friendly Error Messages
# ==========================================

async def send_error(
    update: Update,
    error: Exception
):

    message = str(error)

    if message == "Invalid OTP":

        message = (
            "❌ Invalid OTP.\n"
            "OTP must contain exactly "
            "6 letters or numbers."
        )

    elif message == "OTP not found":

        message = (
            "❌ OTP not found.\n"
            "Please check the OTP and try again."
        )

    elif message == "OTP already used":

        message = (
            "⌛ This OTP has already been used."
        )

    elif message == "File not found":

        message = (
            "❌ File no longer exists."
        )

    elif "100MB" in message or "100 MB" in message:

        message = (
            "❌ File size exceeds "
            "the maximum limit of 100 MB."
        )

    elif "File is too big" in message:

        message = (
            "❌ Telegram Bot API "
            "does not allow files "
            "this large."
        )

    await update.message.reply_text(message)


# ==========================================
# Global Error Handler
# ==========================================

async def error_handler(
    update: object,
    context: ContextTypes.DEFAULT_TYPE
):

    logger.error(
        "Unhandled exception:",
        exc_info=context.error
    )

    if (
        isinstance(update, Update)
        and update.effective_message
    ):

        await update.effective_message.reply_text(

            "❌ Something went wrong.\n"
            "Please try again."

        )


# ==========================================
# /start
# ==========================================

async def start(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    await update.message.reply_text(

f"""
👋 Welcome to <b>{APP_NAME}</b>

🔐 Secure One-Time File & Text Sharing

━━━━━━━━━━━━━━━━━━━━━━

Simply send me:

📝 Text
📄 Documents
🖼 Images

I'll securely upload it and generate
a One-Time Password (OTP).

⏳ OTP expires in 10 minutes.

Type /help to see all commands.
""",

        parse_mode=ParseMode.HTML
    )


# ==========================================
# /help
# ==========================================

async def help_command(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    await update.message.reply_text(

"""
🤖 *SendOnce Help*

Securely upload and download files using one-time OTPs.

━━━━━━━━━━━━━━

📋 *Available Commands*

/start - Start the bot

/help - Show this help

/download - Download using OTP

/about - About SendOnce

/website - Open website

━━━━━━━━━━━━━━

📤 *Supported Uploads*

✅ Text

✅ Documents

✅ PDF

✅ Images

Coming Soon

🎥 Videos

🎵 Audio

🎤 Voice Notes

━━━━━━━━━━━━━━

📥 *Download*

1. Type /download

2. Enter your OTP

3. Receive your file

━━━━━━━━━━━━━━

⚠️ OTPs work only once.
⏳ Valid for 10 minutes.
""",

        parse_mode=ParseMode.MARKDOWN

    )


# ==========================================
# /about
# ==========================================

async def about(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    await update.message.reply_text(

f"""
<b>{APP_NAME}</b>

Version: {BOT_VERSION}

A secure one-time
file sharing application.

Files are permanently deleted
after the first successful download.
""",

        parse_mode=ParseMode.HTML

    )


# ==========================================
# /website
# ==========================================

async def website(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    await update.message.reply_text(

f"""
🌐 Website

{WEBSITE_URL}
"""

    )
# ==========================================
# Handle Text
# ==========================================

async def handle_text(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    text = update.message.text.strip()

    status = await update.message.reply_text(
        "⏳ Uploading text..."
    )

    try:

        result = upload_text(text)

        await status.delete()

        await send_success(
            update,
            result["otp"],
            result["filename"]
        )

    except Exception as e:

        await status.delete()

        await send_error(update, e)


# ==========================================
# Handle Document
# ==========================================

async def handle_document(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    document = update.message.document

    # -------------------------
    # Telegram File Limit Check
    # -------------------------

    if (
        document.file_size
        and document.file_size > 100 * 1024 * 1024
    ):

        await update.message.reply_text(
            "❌ Telegram Bot API does not support "
            "files larger than 100 MB.\n\n"
            "Please use the website for larger files."
        )

        return

    status = await update.message.reply_text(
        "⏳ Uploading file..."
    )

    temp_path = None
    suffix = os.path.splitext(document.file_name)[1]

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp:

            telegram_file = await document.get_file()

            await telegram_file.download_to_drive(
                temp.name
            )

            temp_path = temp.name

        result = upload_file(temp_path)

        await status.delete()

        await send_success(
            update,
            result["otp"],
            result["filename"]
        )

    except BadRequest as e:

        await status.delete()

        if "File is too big" in str(e):

            await update.message.reply_text(

                "❌ Telegram refused this file.\n\n"
                "Please upload files "
                "below Telegram's limit."

            )

        else:

            await send_error(update, e)

    except Exception as e:

        await status.delete()

        await send_error(update, e)

    finally:

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(temp_path)


# ==========================================
# Handle Photo
# ==========================================

async def handle_photo(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    photo = update.message.photo[-1]

    status = await update.message.reply_text(
        "⏳ Uploading image..."
    )

    temp_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        ) as temp:

            telegram_file = await photo.get_file()

            await telegram_file.download_to_drive(
                temp.name
            )

            temp_path = temp.name

        result = upload_file(temp_path)

        await status.delete()

        await send_success(

            update,

            result["otp"],

            result["filename"]

        )

    except Exception as e:

        await status.delete()

        await send_error(update, e)

    finally:

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(temp_path)