/**
 * Created by informatica on 06/05/2016.
 */
//var jwt=require('jsonwebtoken');
module.exports = function (app){
    return {
        add: function (req, res) {
            var Usuario = app.get('usuario');
            Usuario.create({
                nombre: req.body.nombre,
                telefono:req.body.telefono,
                correo: req.body.correo,
                nick: req.body.nick,
                contrasena: req.body.contrasena,
                direccion:req.body.direccion
            }).then(function (usuario) {
                res.json(usuario)
            });
        },
        list: function (req, res) {
            var Usuario = app.get('usuario');
            Usuario.findAll().then(function (usuarios) {
                res.json(usuarios);

            });
        },
        edit: function (req, res) {
            var Usuario = app.get('usuario');
            Usuario.find(req.body.id_usuario).then(function (usuario) {
                if (usuario) {
                    usuario.updateAttributes({
                        nombre: req.body.nombre,
                        telefono:req.body.telefono,
                        correo: req.body.correo,
                        nick: req.body.nick,
                        contrasena: req.body.contrasena,
                        direccion:req.body.direccion
                    });
                } else {
                    res.status(404).send({message: 'Usuario no encontrado'})
                }

            });

        },
        delete: function (req, res) {
            var Usuario = app.get('usuario');
            Usuario.destroy({
                where: {
                    id_usuario: req.body.id_usuario
                }
            });
        },
        prueba: function (req, res) {
            var Usuario = app.get('usuario');
            Usuario.find(req.body.id_usuario).then(function (usuario) {
                if (usuario) {
                    res.json(usuario);
                } else {
                    res.status(404).send({message: 'Usuario no encontrado'})
                }
            });
        },
		registro:function(req,res){
			modelo.sequelize.query("CALL sp_registroUsuario('"+peticion.body.nombre+"','"+peticion.body.telefono+"'," +
                "'"+peticion.body.correo+"','"+peticion.body.nick+"','"+peticion.body.contrasena+"','"+peticin.body.direccion+"');")
                .then(function(err){
					respuesta.send({"mensaje":"Error"+err,"status":"500"});
				})
        },
		login:function(req,res){
			modelo.sequelize.query("CALL sp_autenticarUsuario('"+peticion.body.correo+", "+peticion.body.contrasena+"');").then(function (data){
                respuesta.json(genToken(user));
            }).error(function (err){
                respuesta.sen({"mensaje":"Error"+err,"status":"500"})
            });
		},
        tokenGenerator:function(req, res){
            var token= jwt.sign('SECURE@APP');
            res. send(token);
        }, tokenMiddleware:function (req, res,next) {
            var token = req.headers['x-acces-token'] || req.body.token || req.query.token;
            if (token) {
                jwt.verify(token, 'SECURE@APP', function (err, decoded) {
                    if (err) {
                        return res.status(403).send({
                            success: false,
                            message: 'fallo al validar el token'
                        });
                    }
                    req.user = decoded;
                    next();
                });
            } else {
                return res.status(403).send({
                    success: false,
                    message: 'No se proporciono token'
                });
            }
        }
    }
}

function expiresIn(dias){
    var dateObj=new  Date();
    return dateObj.setDate(dateObj.getDate()+dias);
}
function genToken(user){
    var payload=jwt.sign('SECURE@APP');
    var token={
        "token":payload,
        "user":user,
        "exp":expiresIn(1)
    }
    return token;
}