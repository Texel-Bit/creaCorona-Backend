//=============================
//Puerto
//=============================
const mysql = require('mysql');
process.env.PORT = process.env.PORT || 9445;

//==================================
//Entorno
//==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==================================
//Vencimiento del token 30 dias
//==================================
process.env.CADUCIDAD_TOKEN = '365d';

 
//==================================
//seed de autenticacion
//==================================
// process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";

process.env.SEED = "}HK]LudQBn1-LvPNit36L";

// process.env.URLVTEX = "https://whirlpoolcol.vtexcommercestable.com.br/api/";



//================================== 
//Base de datos
//==================================




//google client


// process.env.CLIENT_ID = process.env.CLIENT_ID || "1064591217868-om45uv23lmkhb0lbudubp87t2547ohhf.apps.googleusercontent.com";