import { ethers } from "./ethers-5.1.esm.min.js";
import TokenWhitelist from '../artifacts/contracts/TokenAdvancedWhitelist.sol/TokenWhitelist.json' assert {type: 'json'}

/* ------------ */
/* Ethers Logic */
/* ------------ */

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Web3 provider
const provider = new ethers.providers.Web3Provider(window.ethereum)

await provider.send("eth_requestAccounts", [])

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, TokenWhitelist.abi, signer);

// get the balance of the connected account
const getBalance = async () => {
	const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const balance = await provider.getBalance(account);
	return ethers.utils.formatEther(balance)
}

const totalMinted = async () => {
	const count = await contract.totalSupply()
	console.log(parseInt(count))
}

const tokenBalance = async () => {
	const tokenBalance = await contract.balanceOf(signer.getAddress())
	return parseInt(tokenBalance)
}

const mintToken = async () => {
	const result = await contract.publicMint(signer.getAddress(), 1, {
		value: ethers.utils.parseEther('1.0')
	})

	await result.wait()
	setTokenBalance()
}

/* ------------------ */
/* Frontend Functions */
/* ------------------ */

async function eventListeners() {
	document.getElementById("balance-button").addEventListener('click', setBalance);
	document.getElementById("mint-button").addEventListener('click', mintPublic)
	document.getElementById("token-balance-button").addEventListener('click', setTokenBalance);
}

async function setTokenBalance() {
	const balance = await tokenBalance()
	document.getElementById("token-balance").innerHTML = balance
}

async function setBalance() {
	const balance = await getBalance()
	document.getElementById("balance").innerHTML = balance
}

async function mintPublic() {
	await mintToken()
}

eventListeners()