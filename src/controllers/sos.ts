import { Sos } from '../models/sos'
import { Request, Response } from 'express'
import { Datainput } from '../models/data'
import { handleErrors } from '../utils'
import { SosPayload } from '../dto/sos'
import createError from 'http-errors'

const sendSos = async (req: Request, res: Response) => {

    try {

        console.log(req.user?.email)
        const data = await Datainput.findOne({ email: req.user?.email }).sort({ time: -1 })

        console.log(data)

        const dateTime = new Date()

        const sosPayload: SosPayload = {
            lastLat: data?.latitude,
            lastLong: data?.longitude,
            time: dateTime,
            temperature: data?.temperature,
            altitude: data?.altitude,
            email: req.user?.email
        }

        const sos = new Sos(sosPayload)
        const savedData = await sos.save()

        if (!savedData) throw createError(500, 'Internal Server Error')

        res.status(201).send(sosPayload)
    } catch (error) {
        console.log(error)
    }
}

const getSos = async (req: Request, res: Response) => {
    try {
        

        const sosArray = await Sos.find({  }).sort({ time: -1 })

        res.status(200).json({
            status: 'success',
            data: sosArray
        })

    } catch (error) {
        handleErrors(error, res)
    }
}

const checkVibrationForSOS = async (req: Request, res: Response) => {

    const entries = req.query.entries
    const vibrationArray = await Datainput.find({
        email: req.user?.email,
    },
        { vibration: 1, _id: 0 }
    ).sort({ time: -1 }).limit(+entries)

    const allZero = vibrationArray.every((vibration) => vibration.vibration === 0)

    if (allZero) {
        return res.status(200).send({
            status: 'success',
            timeRange: `${entries} minutes`,
            message: 'No vibration detected'
        })
    }
    else {
        return res.status(200).send({
            status: 'success',
            timeRange: `${entries} minutes`,
            message: 'Vibration detected'
        })
    }
}

export { sendSos, getSos, checkVibrationForSOS }