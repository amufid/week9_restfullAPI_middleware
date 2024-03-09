const { verifyToken } = require("../lib/jwt.js");
const pool = require("../config/config.js");

// check token 
const authentication = async (req, res, next) => {
   try {
      if (req.headers.authorization) {
         const accessToken = req.headers.authorization.split(" ")[1];

         const { id, email, role} = verifyToken(accessToken);
         const querySearch = `SELECT * FROM users WHERE id = $1`;

         const result = await pool.query(querySearch, [id]);

         // check jika user ada 
         if (result.rows.length > 0) {
            const foundUser = result.rows[0];

            // simpan data ke req 
            req.loggedUser = {
               id: foundUser.id,
               email: foundUser.email,
               role: foundUser.role,
            };

            next();
         } else {
            console.log("1.Unauthenticated");
            throw { name: "Unauthenticated" };
         }
      } else {
         console.log("2.Unauthenticated");
         throw { name: "Unauthenticated" };
      }
   } catch (err) {
      next(err);
   }
};

// check role user 
const authorization = async (req, res, next) => {
   try {
      console.log(req.loggedUser);
      const { role } = req.loggedUser;

      if (role === "admin") {

         next();
      } else {
         console.log("Unauthorized");
         throw { name: "Unauthorized" };
      }
   } catch (err) {
      next(err);
   }
};

module.exports = {
   authentication,
   authorization,
};
