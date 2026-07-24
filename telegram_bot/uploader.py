# ==========================================
# SendOnce Backend API Functions
# ==========================================

import os
import requests

from config import API_URL


# ==========================================
# Common Error Handler
# ==========================================

def handle_response(response: requests.Response):
    """
    Returns JSON if successful.
    Otherwise raises a clean exception with the
    backend's error message.
    """

    if response.ok:
        if response.content:
            return response.json()
        return {}

    try:
        detail = response.json().get("detail")
    except Exception:
        detail = response.text or "Unknown server error"

    raise Exception(detail)


# ==========================================
# OTP Helper
# ==========================================

def get_otp(data: dict):

    return (
        data.get("otp")
        or data.get("Otp")
        or data.get("OTP")
    )


# ==========================================
# Upload Text
# ==========================================

def upload_text(text: str):

    response = requests.post(
        f"{API_URL}/uploadtext",
        json={
            "text": text
        },
        timeout=60
    )

    data = handle_response(response)

    return {

        "otp": get_otp(data),

        "filename": data.get(
            "filename",
            "Text Message"
        ),

        "message": data.get(
            "message",
            ""
        )

    }


# ==========================================
# Upload File
# ==========================================

def upload_file(file_path: str, filename: str):

    with open(file_path, "rb") as file:

        response = requests.post(

            f"{API_URL}/uploadfile",

            files={

                "uploaded_file": (

                    filename,

                    file

                )

            },

            timeout=120

        )

    data = handle_response(response)

    return {

        "otp": get_otp(data),

        "filename": data.get("filename"),

        "message": data.get("message", "")

    }


# ==========================================
# Preview OTP
# ==========================================

def preview_otp(otp: str):

    response = requests.get(

        f"{API_URL}/preview",

        params={
            "otp": otp
        },

        timeout=60

    )

    return handle_response(response)


# ==========================================
# Download Content
# ==========================================

def download_file(otp: str):

    response = requests.get(

        f"{API_URL}/download",

        params={
            "otp": otp
        },

        timeout=120

    )

    # Download endpoint can return either
    # JSON (text)
    # OR
    # FileResponse

    if response.status_code != 200:

        try:
            detail = response.json().get("detail")
        except Exception:
            detail = "Download failed."

        raise Exception(detail)

    content_type = response.headers.get(
        "Content-Type",
        ""
    )

    # --------------------------
    # Text
    # --------------------------

    if "application/json" in content_type:

        data = response.json()

        return {

            "is_text": True,

            "content": data.get(
                "content",
                ""
            ),

            "filename": "Text Message",

            "content_type": content_type

        }

    # --------------------------
    # File
    # --------------------------

    filename = "download"

    disposition = response.headers.get(
        "Content-Disposition",
        ""
    )

    if "filename=" in disposition:

        filename = disposition.split(
            "filename="
        )[1].replace('"', "")

    return {

        "is_text": False,

        "filename": filename,

        "content": response.content,

        "content_type": content_type

    }