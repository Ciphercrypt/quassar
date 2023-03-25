import cv2
import time

CONFIDENCE_THRESHOLD = 0.2
NMS_THRESHOLD = 0.4
COLORS = [(0, 255, 255), (255, 255, 0), (0, 255, 0), (255, 0, 0)]

class_names = []
with open("./vehicle/classes.txt", "r") as f:
    class_names = [cname.strip() for cname in f.readlines()]

    # net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
    # net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA_FP16)

def count(vlist):
    co = 0
    for i in vlist:
        if i == 2 or i == 7 or i==5:
            co = co + 1
    return co


def countVehicle(CCTVID, url, subsignalassociated, collection):
    cap = cv2.VideoCapture(url)
    net = cv2.dnn.readNet("./vehicle/yolov4.weights", "./vehicle/yolov4.cfg")

    net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
    net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)

    model = cv2.dnn_DetectionModel(net)
    model.setInputParams(size=(416, 416), scale=1/255, swapRB=True)

    i=0 
    st = time.time()
    count_window = []
    while True:
        (grabbed, frame) = cap.read()
        if not grabbed:
            break
        
        start = time.time()
        classes, scores, boxes = model.detect(frame, CONFIDENCE_THRESHOLD, NMS_THRESHOLD)
        # print("Classes ",classes,type(classes))
        end = time.time()
        print(f"{CCTVID}'s count : ",count(classes), " Time :",str(end - start))
        count_window.append(count(classes))

        if end - st > 10 :
            st = end
            vehicleCountData = { "CCTVID": CCTVID, "count": math.ceil(sum(count_window) / len(count_window)), "timestamp":end, "signalID":subsignalassociated }
            x = collection.insert_one(vehicleCountData)
            count_window = []
            print(x.inserted_id) 

        for (classid, score, box) in zip(classes, scores, boxes):
            color = COLORS[int(classid) % len(COLORS)]
            label = "%s : %f" % (class_names[classid], score)
            cv2.rectangle(frame, box, color, 2)
            cv2.putText(frame, label, (box[0], box[1]-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        fps = "FPS: %.2f " % (1 / (end - start))
        cv2.putText(frame, fps, (0, 25), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 255), 2)
        # cv2.imshow("output", frame)
        i=i+1
        output = CCTVID + str(i)
        cv2.imwrite(f".vehicle/tp/{output}.png", frame)