import { useEffect } from "react";
import axios from "axios";

function App() {
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/`)
            .then((res) => console.log("Backend response:", res.data))
            .catch((err) => console.error(err));
    }, []);

    return <div>Frontend is running! Check console for backend response.</div>;
}

export default App;
