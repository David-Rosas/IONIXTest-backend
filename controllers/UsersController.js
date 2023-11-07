const User = require("../models/User");
const randomCode = require("../helpers/randomCode");
var jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;
const bcryptjs = require("bcryptjs");
const Role = require("../models/Rol");

module.exports = {
  async Register(data, res) {
    // const userRole = data.user.role.machine_name;
    // if (userRole !== "admin") {
    //   return res
    //     .status(401)
    //     .send({ error: "No estas autorizado para crear tasks" });
    // }
    try {
      let checkUserData = await User.findOne({
        where: { email: data.body.email },
      });

      if (checkUserData !== null) {
        return res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "The email address is already registered.",
              path: "email",
              location: "body",
            },
          ],
        });
      } else {
        //encriptacion de contraseña
        const passwordHast = await bcryptjs.hash(data.body.password, 10);
        await User.create({
          name: data.body.name,
          email: data.body.email,
          rol_id: data.body.rol_id,
          password: passwordHast,
        })
          .then((user) =>
          res.status(201).send({
              id: user.id,
              name: user.name,
              email: user.email,
            })
          )
          .catch((error) => {
            console.log(error);
            return res.status(400).send(error);
          });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
  },
  async Logout(req, res) {
    try{
      res.clearCookie('jwt');
     return res.status(200).send({
        msg: 'logout con exito',
      })
   
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
  },

  async Login(data, res) {
    try {
      const user = await User.findOne({
        where: { email: data.body.email },
        include: Role,
      });

      if (user !== null) {
        if (data.body.email == user.dataValues.email) {
          if (
            await bcryptjs.compare(data.body.password, user.dataValues.password)
          ) {
            var token = jwt.sign(
              {
                id: user.dataValues.id,
                email: user.dataValues.email,
                name: user.dataValues.name,
                role: {
                  name: user.role.dataValues.name,
                  machine_name: user.role.dataValues.machine_name,
                },
              },
              secretJWT
            );

          return res.status(200).send({
              status: "success",
              msg: "Login was successful for the user.",
              userData: {
                id: user.dataValues.id,
                email: user.dataValues.email,
                name: user.dataValues.name,
                role: {
                  name: user.role.dataValues.name,
                  machine_name: user.role.dataValues.machine_name,
                },
                token,
              },
            });
          } else {
           return res.status(400).send({
              errors: [
                {
                  type: "field",
                  value: "",
                  msg: "Incorrect password.",
                  path: "password",
                  location: "body",
                },
              ],
            });
          }
        } else {
         return res.status(400).send({
            errors: [
              {
                type: "field",
                value: "",
                msg: "Incorrect email address.",
                path: "email",
                location: "body",
              },
            ],
          });
        }
      } else {
        return res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "No user found with this email.",
              path: "email",
              location: "body",
            },
          ],
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },

  async validateUserToken(data, res) {
    try {
      const token = data.get("Authorization").split(" ")[1];
      if (token) {
        jwt.verify(token, secretJWT, async function (err, decoded) {
          let checkUserData = await User.findOne({
            where: { id: decoded.idUser },
            attributes: ["id", "name", "email"],
          });
          if (checkUserData.dataValues) {
           return res.json({
              status: "success",
              data: checkUserData.dataValues,
              msg: "Token validado correctamente",
            });
          }
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },

  async generateCodeRecover(data, res) {
    try {
      let checkUserData = await User.findOne({
        where: { email: data.body.email },
      });

      if (checkUserData.dataValues) {
        let codeGenerate = randomCode.generateCodeRandom(30);
        let updateData = User.update(
          { codeRecover: codeGenerate },
          { where: { email: data.body.email } }
        );

        return res.status(200).send({
          status: "success",
          msg: "Recovery code generated correctly",
          code: codeGenerate,
        });
      } else {
       return res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "No user found with this email.",
              path: "email",
              location: "body",
            },
          ],
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },

  async validateRecoverCode(data, res) {
    try {
      let checkUserData = User.findOne({ where: { email: data.body.email } });
      if (checkUserData.dataValues) {
        if (data.body.code == checkUserData.dataValues.codeRecover) {
          let codeGenerate = randomCode.generateCodeRandom(5);
          let updateData = User.update(
            { password: data.body.newPassword, codeRecover: codeGenerate },
            { where: { email: data.body.email } }
          );
         return res.status(200).send({
            status: "success",
            msg: "The password has been changed successfully",
          });
        } else {
         return res.status(400).send({
            errors: [
              {
                type: "field",
                value: "",
                msg: "The code is incorrect",
                path: "code",
                location: "body",
              },
            ],
          });
        }
      } else {
       return res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "No user found with this email.",
              path: "email",
              location: "body",
            },
          ],
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },

  async ListUserExecute(req, res) {
    try {
      const userRole = req.user.role.machine_name;
      if (userRole !== "admin") {
        return res
          .status(401)
          .send({ error: "No estas autorizado para crear tasks" });
      }
      const users = await User.findAll({
        attributes: {
          exclude: [
            "password",
            "codeRecover",
            "rol_id",
            "createdAt",
            "updatedAt",
          ],
        },
        include: [
          {
            model: Role,
            where: { machine_name: "execute" },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });

      res.status(200).send({
        status: "success",
        msg: "List users execute.",
        userData: users,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },
};
