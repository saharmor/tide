export async function getLoca() {
    return await fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        return [data["country"], data["city"]]
      })
  }