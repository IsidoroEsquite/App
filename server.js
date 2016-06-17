/**
 * Created by informatica on 06/05/2016.
 */
(function() {
    var express = require('express');
    var bodyParser = require('body-Parser');
    var morgan = require('morgan');
    var mysql = require('mysql');
    var Sequelize = require('sequelize');
    var jwt=require('jsonwebtoken');

    var sequelize = new Sequelize('db_turismo', 'root', '123', {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 20,
            min: 0
            
        }
    });
    /*
     Declaraciones de los modelos
     */

    var Rol = sequelize.define('rol', {
        idRol: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        nombre: {type: Sequelize.STRING, allowNull: false},
        descripcion:{type: Sequelize.STRING, allowNull: false}
    });

    var Usuario = sequelize.define('usuario', {
        idusuario: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        nombre: {type: Sequelize.STRING, allowNull: false},
        telefono: {type: Sequelize.INTEGER, allowNull: false},
        correo: {type: Sequelize.STRING, allowNull: false},
        nick: {type: Sequelize.STRING, allowNull: false},
        contrasena: {type: Sequelize.STRING, allowNull: false},
        direccion: {type: Sequelize.STRING, allowNull: false}
    });

    var Departamento = sequelize.define('departamento',{
        idDepartamento: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        nombre: {type: Sequelize.STRING, allowNull: false},
        descripcion: {type: Sequelize.STRING, allowNull: false}
    });

    var SitioTuristico = sequelize.define('sitioTuristico', {
        idSitioTuristico: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        nombre: {type: Sequelize.STRING, allowNull: false},
        telefono: {type: Sequelize.INTEGER, allowNull: false},
        descripcion: {type: Sequelize.STRING, allowNull: false},
        direccion: {type: Sequelize.STRING, allowNull: false},
        imagen:{type: Sequelize.STRING, allowNull: false}
    });

    var Hotel = sequelize.define('hotel', {
        idHotel: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        nombre:  {type: Sequelize.STRING, allowNull: false},
        descripcion: {type: Sequelize.STRING, allowNull: false},
        direccion: {type: Sequelize.STRING, allowNull: false},
        latitud: {type: Sequelize.INTEGER},
        longitud: {type: Sequelize.INTEGER},
        imagen: {type: Sequelize.STRING}
    });

    Departamento.hasMany(SitioTuristico, { constraints: true });
    SitioTuristico.belongsTo(Departamento);

    sequelize.sync({ force: true });
    var puerto=3500;
    var conf=require('./config');
    var app=express();
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use('/api/v1', require('./Rutas')(app));
    app.use(morgan('dev'));
    app.set('rol', Rol);
    app.set('usuario', Usuario);
    app.set('departamento', Departamento);
    app.set('sitioTuristico', SitioTuristico);
    app.set('hotel', Hotel);
    app.listen(puerto,function(){
        console.log("Servidor Iniciado en el puerto: " + puerto);
        console.log("Debug del server: ");
    });


})();