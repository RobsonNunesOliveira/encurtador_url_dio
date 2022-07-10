import { Request, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'
import { URLModel } from '../database/model/URL'


export class URLController{
    public async shorten(req: Request, response: Response): Promise<void> {
		// Criar o hash para esta URL
        const { originURL } = req.body
		const url = await URLModel.findOne({ originURL })
		if (url) {
			response.json(url)
			return
		}
		const hash = shortId.generate()
		const shortURL = `${config.API_URL}/${hash}`
		response.json({originURL, hash, shortURL})
		const newURL = await URLModel.create({ hash, shortURL, originURL })
		response.json(newURL)
	}

	 public async redirect(req: Request, response: Response): Promise<void> {
		// Pegar o hash da URL;
		const { hash } = req.params		
		const url = await URLModel.findOne({ hash })

		if (url) {
			response.redirect(url.originURL)
			return
		}

		// Encontrar a URL original pelo hash
		// const url = {
		// 	originURL: 'https://localhost:5000/',
		// 	hash: "8tJ2AmshI",
		// 	shortURL: "http://localhost:5000/8tJ2AmshI"
		// }

		// Redirecionar para URL original a partir encontramos
		// no banco.
		

		response.status(400).json({ error: 'URL not found' })
	}

}
