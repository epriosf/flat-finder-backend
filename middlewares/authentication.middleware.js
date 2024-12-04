import jwt from 'jsonwebtoken';

const authenticationMiddleware = (req, res, next) => {
  //Vamos a obtener el JWT del header del request
  const authHeader = req.header('Authorization');

  //Vamos a validar si esta llegando o no el JWT en el header y adicionalmente que el header impiece con la palabra bearer
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res
      .status(401)
      .json({ message: 'Access denied, no token provided' });
  }

  //Vamos a validar el jwt
  try {
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjcxMmJkYzE5ZDk3OGE1M2U3MDMyMTc3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjkyOTE5ODksImV4cCI6MTcyOTI5NTU4OX0.wYhHJMst7wElZpa8S06HQIq4IkMEwFz6BcWDSm3Eyao
    const token = authHeader.split(' ')[1]; // ["Bearer", "eyJh...."]
    //Validarlo y decodificarlo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //Modificar o agregar un atributo al request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next(error);
  }
};

export default authenticationMiddleware;
