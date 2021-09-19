import { Button, Link } from "@mui/material"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { AiFillGithub } from "react-icons/ai"
import isURL from "validator/lib/isURL"
import "./App.css"
import logo from "./logo.svg"

const API_URL_BASE = "https://l24.dev"
const API_CREATE_SHORT_ROUTE = "/short"

function FormWithButton(props) {
	return (
		<>
			<TextField
				id="outlined-basic"
				fullWidth={true}
				error={props.error}
				helperText={props.helperText}
				placeholder="Shorten your URL"
				variant="outlined"
				onChange={(event) => props.setText(event.target.value)}
				value={props.text}
			/>
			<Button 
				variant="outlined"
				sx={{ m: 3, height: 56 }}
				size={"large"} 
				onClick={() => props.createShort(props.text)}
			>
				Shorten
			</Button>
		</>
	)
}

function ShortTable(props) {
	return (
		<TableContainer component={Paper}>
			<Table aria-label="simple table">
				<TableBody>
					{props.rows.map((row) => (
						<TableRow
							key={row.short}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
						>
							<TableCell align="left">
								<Link href={row.original}>
									{row.original}
								</Link>
							</TableCell>
							<TableCell align="right">
								<Link href={row.original}>
									{row.short}
								</Link>
							</TableCell>
							<TableCell align="right">
								<Button 
									variant="outlined" 
									onClick={() => navigator.clipboard.writeText(row.short)} 
								>
								Copy
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

function App() {
	const [text, setText] = useState("")
	const [helperText, setHelperText] = useState("")
	const [shorts, setShorts] = useState([])
	const [error, setError] = useState(false)

	async function createShort(url) {
		const valid = isURL(url, { 
			protocols: ["http","https"], 
			require_protocol: false, 
			require_host: true, 
			require_port: false, 
			require_valid_protocol: true, 
			allow_underscores: false, 
			host_whitelist: false, 
			host_blacklist: false, 
			allow_trailing_dot: false, 
			allow_protocol_relative_urls: false, 
			disallow_auth: true, 
			validate_length: true,
		})

		if (!valid) {
			setError(true)
			setHelperText("Unable to shorten that link. It is not a valid url.")
			return
		}

		const request = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ url: url })
		}

		const response = await fetch(API_URL_BASE + API_CREATE_SHORT_ROUTE, request)

		if (response.ok === false || response.status !== 200) {
			setError(true)
			setHelperText("Something went wrong on our side - please try again.")
			return
		}

		url = await response.json()
		const newShort = {
			short: API_URL_BASE + "/" + url.redirect_path,
			original: url.scheme + "://" + url.host + url.path + url.query + url.fragment
		}

		// Only keep the last 5 shorts
		if (shorts.length === 5) {
			let newShorts = shorts.slice(1)
			setShorts([
				...newShorts, 
				newShort
			])
		} else {
			setShorts(
				[
					...shorts,
					newShort,
				]
			)
		}

		setText("")
		setError(false)
		setHelperText("")
	}

	return (
		<>
			<img src={logo} alt="" className="App-logo" width={350}/>
			<div className="App">
				<FormWithButton 
					error={error} 
					text={text}
					setText={setText}
					helperText={helperText}
					createShort={createShort}
					shorts={shorts}
				/>
			</div>
			<div className="Table">
				<ShortTable rows={shorts}/>
			</div>
			<div className="Github">
				<Link href="https://github.com/shortener-dev" color="inherit">
					<AiFillGithub size={50}></AiFillGithub>
				</Link>
			</div>
		</>
	)
}

export default App
