import os
import cv2
import numpy as np
import pytesseract as pt
import matplotlib.pyplot as plt
import urllib
import glob
import time
# import keras_ocr
# from PIL import Image
# import easyocr
# from googleapi import get_text_from_image

pt.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

INPUT_WIDTH = 640
INPUT_HEIGHT = 640

# net = cv2.dnn.readNetFromONNX('./data/model/yolo_v5.onnx')
# net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
# net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)

i=0

def get_detections(img, net):
    image = img.copy()
    row, col, d = image.shape

    max_rc = max(row, col)
    input_image = np.zeros((max_rc, max_rc, 3), dtype=np.uint8)
    input_image[0:row, 0:col] = image

    blob = cv2.dnn.blobFromImage(
        input_image, 1/255, (INPUT_WIDTH, INPUT_HEIGHT), swapRB=True, crop=False)
    net.setInput(blob)
    preds = net.forward()
    detections = preds[0]
    # print("detection",detections)
    return input_image, detections


def non_maximum_supression(input_image, detections):
    boxes = []
    confidences = []

    image_w, image_h = input_image.shape[:2]
    x_factor = image_w/INPUT_WIDTH
    y_factor = image_h/INPUT_HEIGHT

    for i in range(len(detections)):
        row = detections[i]
        confidence = row[4]
        if confidence > 0.4:
            class_score = row[5]
            if class_score > 0.25:
                cx, cy, w, h = row[0:4]

                left = int((cx - 0.5*w)*x_factor)
                top = int((cy-0.5*h)*y_factor)
                width = int(w*x_factor)
                height = int(h*y_factor)
                box = np.array([left, top, width, height])

                confidences.append(confidence)
                boxes.append(box)

    boxes_np = np.array(boxes).tolist()
    confidences_np = np.array(confidences).tolist()

    index = cv2.dnn.NMSBoxes(boxes_np, confidences_np, 0.25, 0.45).flatten()

    return boxes_np, confidences_np, index


def drawings(image, boxes_np, confidences_np, index):
    labels = []
    for ind in index:
        x, y, w, h = boxes_np[ind]
        bb_conf = confidences_np[ind]
        conf_text = 'plate: {:.0f}%'.format(bb_conf*100)
        license_text = extract_text(image, boxes_np[ind])
        labels.append(license_text)

        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 255), 2)
        cv2.rectangle(image, (x, y-30), (x+w, y), (255, 0, 255), -1)
        cv2.rectangle(image, (x, y+h), (x+w, y+h+30), (0, 0, 0), -1)

        cv2.putText(image, conf_text, (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1)
        cv2.putText(image, license_text, (x, y+h+27),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 1)

    return image, labels


def yolo_predictions(img, net):
    input_image, detections = get_detections(img, net)
    boxes_np, confidences_np, index = non_maximum_supression(
        input_image, detections)
    result_img, labels = drawings(img, boxes_np, confidences_np, index)
    return result_img, labels

# def extract_text_eocr(image):
#     # Load the EasyOCR reader
#     reader = easyocr.Reader(['en'])

#     # Convert the OpenCV image to a PIL Image
#     from PIL import Image
#     img = Image.fromarray(image)

#     # Perform OCR on the image
#     result = reader.readtext(img)

#     # Extract the predicted text
#     text = ''
#     for box in result:
#         text += box[1] + ' '

#     # Return the extracted text
#     return text


# def extract_text1(image):
#     # Load the Keras OCR pipeline
#     pipeline = keras_ocr.pipeline.Pipeline()

#     # Read and preprocess the image
#     # image = keras_ocr.tools.read(image_path)
#     # image = keras_ocr.tools.resize_image(image, height=640)

#     # Perform OCR on the image
#     prediction_groups = pipeline.recognize([image])

#     # Extract the predicted text
#     text = ''
#     for predictions in prediction_groups:
#         for pred in predictions:
#             text += pred[0] + ' '

#     # Return the extracted text
#     # print("No text ",text)
#     return text

import base64
import requests
import json
import io 
def ocr_space_image(image, overlay=False, api_key='K88068891988957', language='eng'):
    _, compressed_image = cv2.imencode('.jpg', image)
    file_bytes = io.BytesIO(compressed_image)
    img_data = base64.b64encode(compressed_image).decode("utf-8")
    # print(img_data)'data:<content_type>;base64,<base64_image_content>
    bs = "data:image/png;base64,"+img_data
    headers = {'Content-type': 'application/x-www-form-urlencoded'}
    payload = {'isOverlayRequired': overlay,
               'apikey': api_key,
               'language': language,
               'base64image': bs
               }
    response = requests.post('https://api.ocr.space/parse/image',
                             headers=headers,
                             data=payload)

    result = response.content.decode()
    result = json.loads(result)
    parsed_results = result.get("ParsedResults")[0]
    text_detected = parsed_results.get("ParsedText")
    # print("OCR text",text_detected)
    return text_detected


def extract_text(image, bbox):
    x,y,w,h = bbox
    roi = image[y:y+h, x:x+w]

    global i
    # names = "roi" + str(i)
    # cv2.imwrite(f"./data/images/output/{names}.png", roi)

    gray = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    thresh = cv2.cvtColor(thresh, cv2.COLOR_BGR2RGB)
    print("OCR output ",ocr_space_image(thresh))
    # thresh = preprocess_image(image)
    names = "conroithreshDFG" + str(i)
    cv2.imwrite(f"./data/images/output/{names}.png", cv2.vconcat([roi,thresh]))

    # print("Keras OCR : ",extract_text1(roi))
    # print("Google texg : ",get_text_from_image(roi))
    # print("Easy OCR : ",extract_text_eocr(thresh))

    if 0 in roi.shape:
        return ''
    else:
        text = pt.image_to_string(thresh, config='-c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ --psm 7 --oem 1')
        text = text.strip()
        text = text.strip('?')
        text.replace('?','').replace('\n','')
        print(text)
        return text

# def preprocess_image(image):
#     # Convert to grayscale
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     # Apply adaptive thresholding
#     thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)

#     # Apply median filtering
#     filtered = cv2.medianBlur(thresh, 3)

#     # Apply erosion and dilation
#     kernel = np.ones((3,3), np.uint8)
#     eroded = cv2.erode(filtered, kernel, iterations=1)
#     dilated = cv2.dilate(eroded, kernel, iterations=1)

#     return dilated

# def extract_text45(image):
#     # Preprocess the image
#     processed = preprocess_image(image)
#     global i
#     names = "preprocessed" + str(i)
#     cv2.imwrite(f"./data/images/output/{names}.png", cv2.vconcat([image, processed ]))
    
#     # Get the bounding boxes using EasyOCR
#     # reader = easyocr.Reader(['en'], gpu=False)
#     # result = reader.readtext(processed)

#     # Extract the text from the bounding boxes using Tesseract OCR
#     text = ''
#     for bbox in result:
#         x,y,w,h = bbox[0]
#         roi = processed[y:y+h, x:x+w]
#         text += pt.image_to_string(Image.fromarray(roi), lang='eng')

#     return text.strip()


# def extract_text(image, bbox):
#     x,y,w,h = bbox
#     roi = image[y:y+h, x:x+w]
#     global i
#     # Convert the image to grayscale
#     gray = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
#     # Apply image denoising
#     denoised = cv2.GaussianBlur(gray, (3,3), 0)
#     # Apply Otsu's binarization
#     _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#     # Apply image dilation
#     kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
#     dilated = cv2.dilate(binary, kernel, iterations=1)

#     # Invert the image
#     inverted = cv2.bitwise_not(dilated)

#     # Apply image enhancement
#     enhanced = cv2.equalizeHist(inverted)

#     # Convert the image back to RGB 
#     enhanced_rgb = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2RGB)

#     # Save the ROI and enhanced image side by side
#     names = "conroithresh" + str(i)
#     cv2.imwrite(f"./data/images/output/{names}.png", cv2.hconcat([roi, enhanced_rgb]))

#     # Perform OCR on the enhanced image
#     if 0 in roi.shape:
#         return ''
#     else:
#         text = pt.image_to_string(enhanced, config='-c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ --psm 7 --oem 1')
#         text = text.strip()
#         text = text.strip('?')
#         text.replace('?','').replace('\n','')
#         print(text)
#         return text


def url_to_image(url):
    with urllib.request.urlopen(url) as url:
        resp = url.read()
        image = np.asarray(bytearray(resp), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        return image

def saveToCollection(subsignalId, labels, collection):
    print("vehicle set : ",labels)
    for label in labels :
        if label == "" or label == " " or len(label) < 5:
            continue
        vehicleTrackData = { "vehicleID": label, "signalID": subsignalId }
        x = collection.insert_one(vehicleTrackData)
        print("Vehicle inserted : ",label," ", x.inserted_id) 

def addToSet(vehicleSet,labels):
    print("adding labels : ",labels)
    for label in labels :
        vehicleSet.add(label)

def main(subsignalId, path, type, collection, url=True, save=True):
    print("Started analyze for subsignalId : ",subsignalId)
    global i
    vehicleSet = set()
    if type == 'img':
        if url :
            img = url_to_image(path)
        else :
            img = cv2.imread(path)
        try:
            res, labels = yolo_predictions(img, net)            
            # saveToCollection(subsignalId, labels, collection)
            print("Identified labels :", labels)

            if save:
                cv2.imwrite(f"./data/images/output/{subsignalId}.png", res)
                imageBlob = bucket.blob("/")
                imagePath = f"./data/images/output/{subsignalId}.png"
                imageBlob = bucket.blob(subsignalId)
                imageBlob.upload_from_filename(imagePath) 
            return {
                "Labels": labels
            }
        except Exception as e:
            return {
                "error": "Empty Response"
            }
    elif type == 'vid':
        cap = cv2.VideoCapture(path)
        labels_arr = []
        net = cv2.dnn.readNetFromONNX('./data/model/yolo_v5.onnx')
        net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
        net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
        start = time.time()
        while True:
            i = i + 1
            isTrue, img = cap.read()
            if not isTrue:
                break

            try:
                namei = subsignalId + str(i)
                res, labels = yolo_predictions(img, net)
                addToSet(vehicleSet, labels)
                end = time.time()
                print("Time diff : ",end - start)
                if end - start > 10 :
                    start = end
                    saveToCollection(subsignalId, vehicleSet, collection)
                    vehicleSet = set()
                labels_arr.append(labels)
                cv2.imwrite(f"./data/video/output/{namei}.png", res)
            except Exception as e:
                print("error ",e)
                break
            
        return {
            "Labels": labels_arr
        }

