const errorHandler = (err, req, res, next) => {
   console.log(err);
   if (err.name === "Unauthenticated") {
      res.status(401).json({ message: err.name });
   } else if (err.name === "Unauthorized") {
      res.status(403).json({ message: err.name });
   } else {
      res.status(500).json({ message: "Internal Server Error" });
   }
};

module.exports = errorHandler;
