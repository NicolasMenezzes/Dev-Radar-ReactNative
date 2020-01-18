import axios from "axios"

var api = axios.create({
    baseURL: "http://192.168.15.2:7777"
})

export default api