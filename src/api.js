export async function login(username, password) {
  try {
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true };
    }

    return data;
  } catch (error) {
    return error;
  }
}
