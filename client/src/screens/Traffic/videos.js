import cars from './videoplayback.mp4';

const  Videos= ({videoURL})=> {
    return (
   
    <div >
        <video src={cars } width="100%" height="100%"    autoplay="false" />
        
     </div>
    

      
    )
}

export default Videos;

