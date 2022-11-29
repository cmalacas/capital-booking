import Axios from "axios";

class Authservice {

    async register(data) {

        try {

            const response = await Axios.post('/register', data)

            return response.data

        } catch ( error ) {

            return false;

        }

    }

    async getUserData(data) {

        try {

            const response = await Axios.post('/get-user-data', data)

            return response.data

        } catch ( error ) {

            return false;

        }

    }

    async doLogout(data) {

        try {

            const response = await Axios.post('/logout', data)

            return response.data

        } catch ( error ) {

            return false;

        }

    }

}

export default new Authservice();