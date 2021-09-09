import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default () => {
    const [profiles, setProfiles] = useState([]);

    const getProfiles = () => {
        const config = {
            headers: {
                "Conten-Type": "application/json",
                authorization: "Access_Control-Allow-Origin"
            }
        }

        try {
            axios.get("http://localhost:5000/profiles", config)
                .then((res) => {
                    // res.json();
                    var profiles = res.data;
                    // console.log(res.data);
                    setProfiles(profiles);
                });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProfiles();
    }, [])

    return (
        <>
            <ul>
                {profiles.length > 0
                    ? profiles.map((profiles) => <li key={profiles.id}>{profiles.name}</li>)
                    : <h1>No profiles found</h1>}
            </ul>
        </>
    )
}
