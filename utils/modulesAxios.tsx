import axios from 'axios'
const apiEnv = "latest/"
const directoryURL = "directory?"
const instance = axios.create({
    baseURL: "https://api.reworth.app/",
});

const ApiModules = {
    getDirectory: (queryParams:string) =>
        instance({
            method: "GET",
            url: apiEnv+directoryURL+queryParams
        })
}

export default ApiModules