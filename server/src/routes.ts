import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)) // [0 => Dom, 1 => Seg, 2 => Ter, 3 => Ter, 4 => Qui, 5 => Sex, 6 => Sab]
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => { return { week_day: weekDay }})
        }
      }
    })
  })

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date() // coerce => Converte a data em um valor manipulado
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: { lte: date }, // lte ==> menor ou igual (lass than or equal)
        weekDays: { some: { week_day: weekDay } } // procurar pelo menos 1 dia da semana cadastrado
      }
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate()
      },
      include: {
        dayHabits: true
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    }) ?? []

    return { possibleHabits, completedHabits }
  })

  app.patch('/habits/:id/toggle', async (request) => {
    // route param => parâmetro de identificação

    const toggleHabitParams = z.object({
      id: z.string().uuid()
    })

    const { id } = toggleHabitParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    })

    if (!day) day = await prisma.day.create({ data: { date: today } })
    
    let dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id:{
          day_id: day.id,
          habit_id: id
        }
      }
    })

    if(dayHabit) {
      // Remover hábito incompleto
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })
    } else {
      // Completar o hábito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id
        }
      })
    }


  })

  app.get('/summary', async () => {
    // [ { date: 17/01, amount: 5, completed: 1}, { date: 18/01, amount: 2, completed: 2}, ...]
    // Prisma ORM: RAW SAQL => SQLite

    const summary = await prisma.$queryRaw`
      SELECT
        D.id,
        D.date,
        (
          SELECT
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
            FROM habit_week_days HWD
            JOIN habits H
              ON H.id = HWD.habit_id
            WHERE
              HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
              AND H.created_at <= D.date
        ) as amount
      FROM days D
    `

    return summary
  })
}
