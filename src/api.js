export async function userInfo(token) {
  try {
    const response = await fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true };
    }

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

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

export async function logout(token) {
  try {
    const response = await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true };
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getDevices(token) {
  try {
    const response = await fetch("http://localhost:8000/api/devices", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true };
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}
