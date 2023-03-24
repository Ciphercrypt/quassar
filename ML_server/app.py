from flask import Flask,request, jsonify
from main import main
from pymongo import MongoClient
from threading import Thread
from vehicle.detect import countVehicle

app = Flask(__name__)


@app.route('/model',methods=['GET'])
def run_model():
    args = request.args
    name=args.get("name", default="", type=str)
    path=args.get("path", default="", type=str)
    type=args.get("type", default="", type=str)

    # return main(name,path,type,)
    mi = "./data/video/input/img.png"
    imgurl = "https://images.unsplash.com/photo-1504381270825-025726abb1de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bnVtYmVyJTIwcGxhdGV8ZW58MHx8MHx8&w=1000&q=80"
    vdurl = "./data/video/input/mumbai.mp4"
    return main("VideoInputImgFile",mi,"img",vehicleTrackingCollection,False)
    # return main("VideoInputFile",vdurl,"vid")

@app.route('/',methods=['GET'])
def hello() :
    return "Hello World"

# './data/video/input/mumbai.mp4'   

client = MongoClient('mongodb+srv://avishkar:mayuri@cluster0.c4hj8.mongodb.net/acp?retryWrites=true&w=majority')
db = client['acp']
vehicleCountCollection = db['VehicleCount']
vehicleTrackingCollection = db['VehicleTracking']

@app.route('/analyze', methods=['POST'])
def analyze():
    
    CCTVID = request.json["CCTVID"]
    url = request.json["videoFeedURL"]
    subsignalassociated = request.json["subsignalassociated"]

    # Thread(target=countVehicle, args=(CCTVID, url, subsignalassociated, vehicleCountCollection)).start()
    Thread(target=main, args=(subsignalassociated, url, "vid",vehicleTrackingCollection)).start()
    return jsonify({'message': 'Analysis started in the background.'}), 200

if __name__ == '__main__':
    app.run(debug=True)