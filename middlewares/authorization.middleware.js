const authorizationMiddleware = (roles) => {
  return (req, res, next) => {
    //Debemos obtener el rol del usuario que esta haciendo el request
    const userRole = req.user.role;
    console.log('userRole', userRole);
    //verificar si el rol del usuario que esta haciendo el request, tiene permitido acceder al servicio
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

export default authorizationMiddleware;
