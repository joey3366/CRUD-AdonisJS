import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  //GET ALL
  public async index({request}: HttpContextContract) {
    const input = request.all();
    if (input.txtBuscar !==undefined) {
      return await User.query().where('identificacion', input.txtBuscar)
    }
    return await User.all()
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const userSchema = schema.create({
      identificacion: schema.string([
        rules.minLength(4)
      ]),
      nombre: schema.string(),
      edad: schema.number(),
      url_foto: schema.string()
    })
    try {
      const user = await request.validate({schema: userSchema})
      await User.create(user)
      return response.json({
        res: true,
        message: 'usuario insertado correctamente'
      })
    } catch (error) {
      response.badRequest(error.messages)
    } 
    
  }

  // GET SINGLE
  public async show({ params }: HttpContextContract) {
    // CON EL MODELO UTILIZO LA FUNCION findByOrFail('Nombre del campo', parametro de usuario)
    return await User.findByOrFail('id', params.id)
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    // SE TIENE QUE CREAR UN ESQUEMA (O ESO ENTENDI)
    const userSchema = schema.create({
      //RECIBE COMO PARAMETROS LOS CAMPOS, A LOS CUALES ASIGNAMOS SU TIPO DE ELEMENTO Y 
      //PODEMOS ASIGNAR REGLAS COMO SE VE ACA 
      identificacion: schema.string([
        rules.minLength(4)
      ]),
      nombre: schema.string(),
      edad: schema.number(),
      // PARA QUE EL CAMPO PUEDA SER INDEFINIDO O NULO SE USA EL nullableAndOptional()
      url_foto: schema.string.nullableAndOptional()
    })

    try {
      // VIENE Y SE VALIDA EL ESQUEMA, ES DECIR QUE SE CUMPLAN LAS CONDICIONES
      const user = await request.validate({schema: userSchema})
      // SE CREA E INSERTA EL USUARIO EN LA BD
      await User.query().where('id', params.id).update(user);
      // RESPUESTA DESDE EL SERVIDOR
      return response.json({
        res: true,
        message: 'usuario Modificado correctamente'
      })
    } catch (error) {
      // SI ALGO SALE MAL, CAPTURO EL ERROR Y LO DEVUELVO COMO RESPUESTA
      response.badRequest(error.messages)
    }
  }

  public async destroy({params, response}: HttpContextContract) {
    const user = await User.findByOrFail('id', params.id)
    await user.delete();
    return response.json({
      res: true,
      message: 'Usuario eliminado correctamente'
    })
  }

  async upload({params, request, response}: HttpContextContract){
    const foto = request.file('url_foto', {
      size: '3mb',
      extnames: ['jpg', 'png', 'gif', 'jpeg'],
    })
    const filename = params.id + "." + foto?.extname;
    await foto?.move('./public/fotos', {
      name: filename, 
      overwrite: true
    })

    if (!foto?.isValid) {
      return response.status(422).send({
        res: false,
        message: foto?.errors
      })
    }

    const user = await User.findByOrFail('id', params.id)
    user.url_foto = filename
    await user.save();

    return response.json({
      res: true,
      message: "foto cargada correctamente"
    })

  }
}
