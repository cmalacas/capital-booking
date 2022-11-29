import Axios from "axios";

class Authservice {

    async register(data) {

        try {

            const response = await Axios.post('/register', data)

            return response.data

        } catch ( error ) {

            console.log('error', error.response);

            return error.response.data;

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

    async doLogin(data) {

        try {

            const response = await Axios.post('/login', data)

            return response.data

        } catch ( error ) {

            return response.error;

        }

    }

}

export default new Authservice();