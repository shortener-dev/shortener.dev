import { rest } from "msw"

function makeHash(length) {
	var result           = ""
	var characters       = "abcdefghijklmnopqrstuvwxyz0123456789"
	var charactersLength = characters.length
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * 
 charactersLength))
	}
	return result
}

export const handlers = [
	rest.post("https://l24.dev/short", (req, res, ctx) => {
		let url = null
		console.log("making request")
		try {
			url = new URL(req.body.url)
		} catch (error) {
			console.log(error)
			return res(
				ctx.status(400)
			)
		}
		console.log(url)
		return res(
			ctx.status(200),
			ctx.json({
				redirect_path: makeHash(7),
				scheme: url.protocol.substring(0, url.protocol.length - 1),
				host: url.hostname,
				path: url.pathname,
				query: url.search.substring(1),
				fragment: url.hash.substring(1),
			}),
		)
	}),
]