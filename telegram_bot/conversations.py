from io import BytesIO

from telegram import Update
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    MessageHandler,
    filters,
)

from uploader import preview_otp, download_file

# ==========================================
# Conversation States
# ==========================================

WAITING_FOR_OTP = 1


# ==========================================
# /download
# ==========================================

async def download_start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    await update.message.reply_text(
        "📥 *Download File*\n\n"
        "Please enter your 6-character OTP.\n\n"
        "Example:\n"
        "`ABC123`\n\n"
        "Type /cancel to cancel.",
        parse_mode="Markdown"
    )

    return WAITING_FOR_OTP


# ==========================================
# Receive OTP
# ==========================================

async def receive_otp(update: Update, context: ContextTypes.DEFAULT_TYPE):

    otp = update.message.text.strip().upper()

    status = await update.message.reply_text(
        "⏳ Checking OTP..."
    )

    try:

        preview = preview_otp(otp)

        result = download_file(otp)

        # -----------------------------
        # Text
        # -----------------------------
        if result["is_text"]:

            await status.delete()

            await update.message.reply_text(
                f"📝 *Text Content*\n\n{result['content']}",
                parse_mode="Markdown"
            )

            return ConversationHandler.END

        # -----------------------------
        # File
        # -----------------------------
        file_bytes = BytesIO(result["content"])
        file_bytes.name = result["filename"]

        await status.edit_text("📤 Sending file...")

        content_type = result["content_type"]

        if content_type.startswith("image/"):

            await update.message.reply_photo(
                photo=file_bytes,
                filename=result["filename"]
            )

        elif content_type.startswith("video/"):

            await update.message.reply_video(
                video=file_bytes,
                filename=result["filename"]
            )

        elif content_type.startswith("audio/"):

            await update.message.reply_audio(
                audio=file_bytes,
                filename=result["filename"]
            )

        else:

            await update.message.reply_document(
                document=file_bytes,
                filename=result["filename"]
            )

        await status.delete()

        return ConversationHandler.END

    except Exception as e:

        await status.edit_text(
            f"❌ {str(e)}\n\n"
            "Please enter a valid OTP or type /cancel."
        )

        return WAITING_FOR_OTP


# ==========================================
# Cancel
# ==========================================

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):

    await update.message.reply_text(
        "❌ Download cancelled."
    )

    return ConversationHandler.END


# ==========================================
# Conversation Handler
# ==========================================

download_conversation = ConversationHandler(

    entry_points=[
        CommandHandler("download", download_start)
    ],

    states={

        WAITING_FOR_OTP: [

            MessageHandler(
                filters.TEXT & ~filters.COMMAND,
                receive_otp
            )

        ]

    },

    fallbacks=[

        CommandHandler("cancel", cancel)

    ]
)