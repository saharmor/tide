import ReactGA from 'react-ga4'

export async function getLoca() {
    return await fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            return [data["country"], data["city"]]
        })
}


export function trackEvent(category, action, label, value) {
    ReactGA.event({ category, action, label, value });
}