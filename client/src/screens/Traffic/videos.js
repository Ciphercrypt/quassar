import cars from './videoplayback.mp4';

function Videos() {
    return (
   
    <div >
        <video src={cars } width="600" height="300"   align-items= 'left' autoplay="true" />
        <video src={cars } width="600" height="300"   align-items= 'right' autoplay="true" />
        <video src={cars } width="600" height="300"   align-items= 'left' autoplay="true" />
        <video src={cars } width="600" height="300"   align-items= 'right' autoplay="true" />
     </div>
    

      
    )
}

export { Videos }
