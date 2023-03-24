import io
import os
import cv2

# Import the Google Cloud client library
from google.cloud import vision
from google.cloud.vision_v1 import types

# Set the environment variable for the Google Cloud service account key
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './service_key.json'

# Instantiate the Google Vision client
client = vision.ImageAnnotatorClient()

def get_text_from_image(image):
    print("Google function called")
    # Convert the CV2 image to a byte stream
    _, buffer = cv2.imencode('.jpg', image)
    content = buffer.tobytes()

    # Construct an Image object from the image byte stream
    image = types.Image(content=content)
    try:
        response = client.text_detection(image=image)
        texts = response.text_annotations
    except Exception as e:
        print("Error in Google",e)
        return 'no output'

    # Detect text in the image using the Google Vision API
    # response = client.text_detection(image=image)
    # texts = response.text_annotations

    # Extract the recognized text from the response
    if texts:
        return texts[0].description
    else:
        return ''
