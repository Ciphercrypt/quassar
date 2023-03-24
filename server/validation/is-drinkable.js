
const axios = require('axios');



const FindDrinkability = async (data) => {


  try {

    
    const av= await  axios.post('http://localhost:8000/predict', {
      ph: parseFloat(data.PHvalue),
      conduct: parseFloat(data.Conductivity),
      turbidity:parseFloat(data.Turbidity)
    })


   // const av={"data":1};

    if(av.status==400)
    {
      return "0";
    }
    else
    return av;
    
  } catch (error) {
   return error;
  }
}



module.exports = FindDrinkability;
