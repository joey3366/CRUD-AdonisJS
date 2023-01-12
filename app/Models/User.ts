//import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName:'nombre'})
  public nombre: string

  @column({columnName:'identificacion'})
  public identificacion: string

  @column({columnName:'edad'})
  public edad: number


}
