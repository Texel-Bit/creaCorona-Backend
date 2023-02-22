const {
    createBrecha,updateBrecha
  
  } = require("../models/brecha");
  





exports.createBrecha = async(req, res) => {

    try {
    const { brechaName, brechaColorPath} = req.body
  const  data= {
    brechaName,
    brechaColorPath,
    
      }

   
      const createdBrecha = await createBrecha(data);

      res.json({
        status: true,
        data: createdBrecha,
      });
    } catch (error) {
  
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No pudo ser creada la brecha',
        },
      });
    }
  };


  exports.updateBrecha =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idbrecha, brechaName, brechaColorPath} = req.body;

    
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }

      const  data= {
        idbrecha:+idbrecha,

        brechaName,
        brechaColorPath,
        
          }


  
    updateBrecha(data, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          error: err,
        });
      }
      
  
  
      res.json({
        status: true,
        user: result,
      });
    });
  };
  
//sin uso