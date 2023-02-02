import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
    public async register ({auth, request, response}: HttpContextContract){
        const userSchema = schema.create({
            email: schema.string({trim: true}, [rules.email(), rules.unique({table: 'users_login', column: 'email', caseInsensitive: true})])
        })
    }

    public async login ({auth, request, response}: HttpContextContract){
        const email = request.input('email')
        const password = request.input('password')

        try {
            await auth.use("web").attempt(email,password)
            return response.status(200).send({
                res: true,
                message: "Sesion iniciada correctamente"
            })
        } catch (error) {
            return response.badRequest('Credenciales incorrectas')
        }
    }
}
