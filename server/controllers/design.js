const {
  createDesign,updateDesign, getAllDesign, getDesignById
  
  } = require("../models/design");
  const { subirArchivoImagen } = require("../helpers/subirarchivos");






exports.createDesign = async(req, res) => {
  const image = await subirArchivoImagen(req.files, ["jpg", "png", "jpeg"], "uploads/Design");


    try {
    const {  DesignName,DesignSellPrice, idDesignType  } = req.body
  const  data= {
    DesignImagePath:image,
    DesignName,       
    DesignSellPrice:+DesignSellPrice,
    DesignType:{ connect: { idDesignType: +idDesignType } },
      }

   
      const createdDesign = await createDesign(data);

      res.json({
        status: true,
        data: createdDesign,
      });
    } catch (error) {
  
      return res.status(400).json({
        status: false,
        err: {
          message: 'No pudo ser el color del diseño',
        },
      });
    }
  };


  exports.updateDesign =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idDesign,  DesignName,DesignSellPrice, idDesignType  } = req.body
 
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
    const  data= {
      idDesign:+idDesign,
      DesignName,       
      DesignSellPrice:+DesignSellPrice,  
    
      DesignType:{ connect: { idDesignType: +idDesignType } },    }

    
      
      if (req.files) {
        const image = await subirArchivoImagen(
          req.files,
          ["jpg", "png", "jpeg"],
          "uploads/Design"
        );
  
        const design = await getDesignById(data);
  
     
        const filePath = path.join(process.cwd(), design.DesignImagePath);
  
        
        (data.DesignImagePath = image), fs.unlinkSync(filePath);
      }
 
    
  
      updateDesign(data, (err, result) => {
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

  exports.getAllDesign  = async (req, res) => {
    try {
      // Obtener todos los usuarios desde la base de datos
      const allDesign  = await getAllDesign();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allDesign,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las Design',
      });
    }
  };
//sin uso






